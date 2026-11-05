import React, { useState, useEffect } from "react";
import { Clock, Play, Pause, RotateCcw } from "lucide-react";

export const SESSION_TIMER_STORAGE_KEYS = {
  START_TIME: "operator_session_start_time",
  IS_PAUSED: "operator_session_is_paused",
  PAUSED_TIME: "operator_session_paused_time",
  ACCUMULATED_PAUSED: "operator_session_accumulated_paused_ms",
};

export default function SessionTimer({ className = "" }) {
  // Initialize start time from storage or create now if missing
  const [startTime, setStartTime] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_TIMER_STORAGE_KEYS.START_TIME);
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      const now = Date.now();
      localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.START_TIME, String(now));
      return now;
    } catch {
      return Date.now();
    }
  });

  const [isPaused, setIsPaused] = useState(() => {
    try {
      return localStorage.getItem(SESSION_TIMER_STORAGE_KEYS.IS_PAUSED) === "true";
    } catch {
      return false;
    }
  });

  const [pausedAt, setPausedAt] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_TIMER_STORAGE_KEYS.PAUSED_TIME);
      return saved ? parseInt(saved, 10) : null;
    } catch {
      return null;
    }
  });

  const [accumulatedPausedMs, setAccumulatedPausedMs] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_TIMER_STORAGE_KEYS.ACCUMULATED_PAUSED);
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [now, setNow] = useState(Date.now());

  // Keep digital clock ticking every 1 second when active
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Compute elapsed active time
  const effectiveNow = isPaused && pausedAt ? pausedAt : now;
  const elapsedMs = Math.max(0, effectiveNow - startTime - accumulatedPausedMs);
  const totalSeconds = Math.floor(elapsedMs / 1000);

  // Format into HH:MM:SS
  const formatTime = (sec) => {
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const seconds = sec % 60;
    const pad = (n) => String(n).padStart(2, "0");
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };

  // Toggle Stop / Resume
  const handleTogglePause = () => {
    if (!isPaused) {
      // Stopping / Pausing session
      const pauseTimestamp = Date.now();
      setIsPaused(true);
      setPausedAt(pauseTimestamp);
      try {
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.IS_PAUSED, "true");
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.PAUSED_TIME, String(pauseTimestamp));
      } catch (e) {
        console.warn("Session timer save error:", e);
      }
    } else {
      // Resuming session
      const resumeTimestamp = Date.now();
      const additionalPaused = pausedAt ? Math.max(0, resumeTimestamp - pausedAt) : 0;
      const newAccumulated = accumulatedPausedMs + additionalPaused;

      setIsPaused(false);
      setPausedAt(null);
      setAccumulatedPausedMs(newAccumulated);
      setNow(resumeTimestamp);

      try {
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.IS_PAUSED, "false");
        localStorage.removeItem(SESSION_TIMER_STORAGE_KEYS.PAUSED_TIME);
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.ACCUMULATED_PAUSED, String(newAccumulated));
      } catch (e) {
        console.warn("Session timer save error:", e);
      }
    }
  };

  // Reset session counter
  const handleReset = () => {
    if (window.confirm("Reset your session time counter to 00:00:00?")) {
      const resetTime = Date.now();
      setStartTime(resetTime);
      setIsPaused(false);
      setPausedAt(null);
      setAccumulatedPausedMs(0);
      setNow(resetTime);

      try {
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.START_TIME, String(resetTime));
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.IS_PAUSED, "false");
        localStorage.removeItem(SESSION_TIMER_STORAGE_KEYS.PAUSED_TIME);
        localStorage.setItem(SESSION_TIMER_STORAGE_KEYS.ACCUMULATED_PAUSED, "0");
      } catch (e) {
        console.warn("Session timer save error:", e);
      }
    }
  };

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-slate-200/90 shadow-2xs ${className}`}
      title={isPaused ? "Session timer is stopped/paused" : "Session timer is actively tracking your work time"}
    >
      {/* Status Dot & Clock Icon */}
      <div className="flex items-center gap-1.5">
        {isPaused ? (
          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
        ) : (
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0e6b38]" />
          </span>
        )}
        <Clock className={`w-3.5 h-3.5 ${isPaused ? "text-amber-600" : "text-[#0e6b38]"}`} />
      </div>

      {/* Label */}
      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden sm:inline select-none">
        Session:
      </span>

      {/* Digital Stopwatch Display */}
      <span
        className={`font-mono font-bold text-[13px] tracking-wider select-none min-w-[64px] text-center ${
          isPaused ? "text-amber-700" : "text-slate-800"
        }`}
      >
        {formatTime(totalSeconds)}
      </span>

      {/* Status Badge */}
      <span
        className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border select-none ${
          isPaused
            ? "bg-amber-50 text-amber-700 border-amber-200"
            : "bg-emerald-50 text-emerald-800 border-emerald-200"
        }`}
      >
        {isPaused ? "Stopped" : "Active"}
      </span>

      {/* Stop / Resume Button */}
      <button
        type="button"
        onClick={handleTogglePause}
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
          isPaused
            ? "bg-[#0e6b38] hover:bg-[#0b542c] text-white border-[#0e6b38] shadow-2xs"
            : "bg-slate-50 hover:bg-amber-50 text-slate-700 hover:text-amber-700 border-slate-200/90 hover:border-amber-200"
        }`}
        title={isPaused ? "Resume tracking session" : "Stop/pause tracking session"}
      >
        {isPaused ? (
          <>
            <Play className="w-3 h-3 fill-current" />
            <span>Resume</span>
          </>
        ) : (
          <>
            <Pause className="w-3 h-3 fill-current" />
            <span>Stop</span>
          </>
        )}
      </button>

      {/* Reset Button */}
      <button
        type="button"
        onClick={handleReset}
        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        title="Reset session counter to 00:00:00"
      >
        <RotateCcw className="w-3 h-3" />
      </button>
    </div>
  );
}

