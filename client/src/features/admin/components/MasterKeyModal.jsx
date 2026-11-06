import React, { useState, useEffect } from "react";
import {
  X,
  KeyRound,
  ShieldCheck,
  Lock,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  Clock,
  AlertCircle,
  HelpCircle,
  Sparkles,
  ChevronRight,
  History,
  Archive,
} from "lucide-react";

export default function MasterKeyModal({ isOpen, onClose }) {
  const [activeKey, setActiveKey] = useState("AbdivaAdmin@2026#SecureKey!");
  const [activeKeyId, setActiveKeyId] = useState("KEY-2026-V1");
  const [vaultHistory, setVaultHistory] = useState([]);
  const [showActivePassword, setShowActivePassword] = useState(false);
  const [copiedKeyId, setCopiedKeyId] = useState(null);

  // Form state to update master password
  const [newPassword, setNewPassword] = useState("");
  const [keyLabel, setKeyLabel] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Track which history vault entries have their password unmasked
  const [revealedVaultKeys, setRevealedVaultKeys] = useState({});

  // 1. Fetch Master Key Data from Backend
  const fetchKeyData = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/admin/master-key");
      const json = await res.json();
      if (json.success && json.data) {
        setActiveKey(json.data.activeKey || "AbdivaAdmin@2026#SecureKey!");
        setActiveKeyId(json.data.activeKeyId || "KEY-2026-V1");
        if (Array.isArray(json.data.vault)) {
          setVaultHistory(json.data.vault);
        }
        // Cache to localStorage for instant client exports
        localStorage.setItem("abdiva_active_master_key", json.data.activeKey);
        localStorage.setItem("abdiva_active_master_key_id", json.data.activeKeyId);
      }
    } catch (err) {
      console.warn("Failed to fetch master key settings:", err);
      // Fallback to local storage
      const cached = localStorage.getItem("abdiva_active_master_key");
      const cachedId = localStorage.getItem("abdiva_active_master_key_id");
      if (cached) setActiveKey(cached);
      if (cachedId) setActiveKeyId(cachedId);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchKeyData();
      setFeedback(null);
      setErrorMsg(null);
      setNewPassword("");
      setKeyLabel("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Copy helper
  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  // Toggle reveal for vault item
  const toggleRevealVaultKey = (id) => {
    setRevealedVaultKeys((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Generate strong random password
  const handleGenerateStrongKey = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
    let gen = "Abdiva@";
    for (let i = 0; i < 14; i++) {
      gen += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewPassword(gen);
    setShowNewPassword(true);
  };

  // Submit new master password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setFeedback(null);
    setErrorMsg(null);

    if (!newPassword || newPassword.trim().length < 6) {
      setErrorMsg("New master password must be at least 6 characters long.");
      return;
    }

    if (newPassword.trim() === activeKey) {
      setErrorMsg("New password cannot be identical to the currently active password.");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("http://localhost:3000/api/admin/master-key", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newPassword: newPassword.trim(),
          label: keyLabel.trim() || undefined,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Failed to update master password");
      }

      // Update state
      setActiveKey(json.data.activeKey);
      setActiveKeyId(json.data.activeKeyId);
      if (Array.isArray(json.data.vault)) {
        setVaultHistory(json.data.vault);
      }

      // Cache locally
      localStorage.setItem("abdiva_active_master_key", json.data.activeKey);
      localStorage.setItem("abdiva_active_master_key_id", json.data.activeKeyId);

      setFeedback(
        `Master Decryption Key successfully updated to ${json.data.activeKeyId}. The previous key has been safely archived in the Vault below.`
      );
      setNewPassword("");
      setKeyLabel("");
    } catch (err) {
      console.error("Update error:", err);
      setErrorMsg(err.message || "Failed to update master decryption key.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-5 sm:px-7 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#0e6b38] flex items-center justify-center shrink-0 border border-emerald-200">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Admin Master Decryption Password
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-900 text-emerald-400">
                  {activeKeyId}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Manage master encryption keys for opening password-protected daily reports and backups.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* Notifications */}
          {feedback && (
            <div className="p-3.5 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-emerald-50 text-emerald-900 border border-emerald-200">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{feedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setFeedback(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl text-xs font-semibold flex items-start justify-between gap-3 bg-red-50 text-red-900 border border-red-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMsg(null)}
                className="text-red-700 hover:text-red-900 font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* 1. Current Active Master Key Display */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-5 rounded-2xl shadow-sm border border-slate-700 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Currently Active Decryption Key
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active for All New Downloads
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/80 p-3.5 rounded-xl border border-slate-700/80">
              <div className="flex items-center gap-3 overflow-hidden">
                <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="font-mono text-sm sm:text-base font-bold text-emerald-400 tracking-wide select-all truncate">
                  {showActivePassword ? activeKey : "••••••••••••••••••••••••"}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowActivePassword(!showActivePassword)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                  title={showActivePassword ? "Hide password" : "Show password"}
                >
                  {showActivePassword ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5" />
                      <span>Hide</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5" />
                      <span>Show</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(activeKey, "active")}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#0e6b38] hover:bg-[#0b542c] text-white transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  {copiedKeyId === "active" ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Key</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-slate-400">
              Use this key to unlock and extract any `.zip` daily report or backup downloaded by operators.
            </p>
          </div>

          {/* 2. Change / Rotate Master Password Form */}
          <form
            onSubmit={handleUpdatePassword}
            className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3.5"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#0e6b38]" />
                <span>Rotate / Change Master Password</span>
              </h4>
              <button
                type="button"
                onClick={handleGenerateStrongKey}
                className="text-[11px] font-bold text-[#0e6b38] hover:text-[#0b542c] flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Generate Strong Key</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  New Master Password *
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new master key (min 6 chars)..."
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-semibold text-slate-800 pr-10 focus:outline-none focus:border-[#118848]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Rotation Note / Label (Optional)
                </label>
                <input
                  type="text"
                  value={keyLabel}
                  onChange={(e) => setKeyLabel(e.target.value)}
                  placeholder="e.g. November Routine Rotation"
                  className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-1">
              <button
                type="submit"
                disabled={isSaving || !newPassword.trim()}
                className="inline-flex items-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-xs transition-all cursor-pointer shadow-xs"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Updating Key in Vault...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Save & Activate New Master Key</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* 3. The "What if backup was made with old password?" Guarantee & FAQ */}
          <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4 sm:p-5 flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5 border border-blue-200">
              <HelpCircle className="w-5 h-5 text-blue-700" />
            </div>
            <div className="space-y-1.5 flex-1">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>What happens to backups downloaded with an older password?</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                When an operator downloads an encrypted ZIP archive, that file is <strong>permanently sealed with the exact password</strong> active
                at that specific moment. Changing the password now <strong>never breaks or invalidates older backups</strong>.
              </p>
              <p className="text-xs text-slate-700 leading-relaxed font-medium pt-0.5">
                💡 <strong>How to unlock older backups:</strong> Every downloaded ZIP contains the <strong>Key ID (e.g. {activeKeyId})</strong> in its
                metadata. When you need to decrypt an older file, simply look up the matching Key ID or creation date in the <strong>Decryption Key Vault History</strong> below!
              </p>
            </div>
          </div>

          {/* 4. Decryption Key History Vault (Timeline Table) */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-2">
                <History className="w-4 h-4 text-[#0e6b38]" />
                <span>Decryption Key History Vault ({vaultHistory.length} Recorded Keys)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                Retains all past passwords for historical archive unlocking
              </span>
            </div>

            {vaultHistory.length === 0 ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-xs text-slate-500">
                No past keys recorded yet. As you rotate the master password, previous keys will appear here.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse min-w-[620px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-bold uppercase text-[11px] border-b border-slate-200">
                      <th className="py-2.5 px-4">Key ID</th>
                      <th className="py-2.5 px-4">Password</th>
                      <th className="py-2.5 px-4">Active Date Range</th>
                      <th className="py-2.5 px-4">Status</th>
                      <th className="py-2.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {vaultHistory.map((entry, idx) => {
                      const isRevealed = !!revealedVaultKeys[entry.keyId || idx];
                      const isActive = entry.status === "active";
                      const actDate = entry.activatedAt
                        ? new Date(entry.activatedAt).toLocaleDateString()
                        : "Launch";
                      const deactDate = entry.deactivatedAt
                        ? new Date(entry.deactivatedAt).toLocaleDateString()
                        : "Present";

                      return (
                        <tr
                          key={entry.keyId || idx}
                          className={`hover:bg-slate-50/70 ${isActive ? "bg-emerald-50/30" : ""}`}
                        >
                          <td className="py-2.5 px-4 font-mono font-bold text-slate-900">
                            <span className="flex items-center gap-1.5">
                              {isActive ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              ) : (
                                <Archive className="w-3 h-3 text-slate-400" />
                              )}
                              <span>{entry.keyId || `KEY-V${entry.version}`}</span>
                            </span>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {entry.label || "Master Key"}
                            </div>
                          </td>

                          <td className="py-2.5 px-4 font-mono">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-800">
                                {isRevealed ? entry.password : "••••••••••••"}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleRevealVaultKey(entry.keyId || idx)}
                                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                title={isRevealed ? "Hide" : "Reveal"}
                              >
                                {isRevealed ? (
                                  <EyeOff className="w-3.5 h-3.5" />
                                ) : (
                                  <Eye className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>

                          <td className="py-2.5 px-4 text-slate-600 font-medium text-[11px]">
                            {actDate} → {deactDate}
                          </td>

                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                isActive
                                  ? "bg-emerald-100 text-[#0e6b38] border border-emerald-300"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              }`}
                            >
                              {isActive ? "Active (Current)" : "Archived"}
                            </span>
                          </td>

                          <td className="py-2.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => handleCopy(entry.password, entry.keyId || idx)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
                              title="Copy this password to decrypt backup files from this period"
                            >
                              {copiedKeyId === (entry.keyId || idx) ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3 text-slate-500" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 sm:px-7 py-3.5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Master passwords are stored securely and never visible to operators.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

