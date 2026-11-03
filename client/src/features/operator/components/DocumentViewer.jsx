import React, { useState, useRef } from "react";
import sampleDocImg from "../../../assets/sample-scanned-doc.jpg";

export default function DocumentViewer({
  customImageSrc,
  onLoadSampleRecord,
  isSplitView,
  onToggleSplitView,
  onClose,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageSrc = customImageSrc || sampleDocImg;

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  };

  // Pan handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col h-full min-h-[480px]">
      {/* Viewer Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-100">Scanned Document Inspector</span>
          <span className="text-slate-400 hidden sm:inline">• (Pan & Zoom to read records)</span>
        </div>

        {/* Controls: Zoom, Split Screen Toggle, Close */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer"
            title="Zoom Out"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
            </svg>
          </button>

          <span className="px-2 py-1 bg-slate-800 rounded-lg font-mono text-[11px] text-emerald-400">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer"
            title="Zoom In"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer text-[11px] px-2 font-medium"
            title="Reset Zoom"
          >
            Reset
          </button>

          {/* Quick Sample Selector */}
          {onLoadSampleRecord && (
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 ml-1">
              <span className="text-[11px] text-slate-400">Sample:</span>
              <button
                type="button"
                onClick={() => onLoadSampleRecord(1)}
                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-[11px] font-bold text-white cursor-pointer"
                title="Load Record #1 from scanned sheet"
              >
                #1
              </button>
              <button
                type="button"
                onClick={() => onLoadSampleRecord(2)}
                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-[11px] font-bold text-white cursor-pointer"
                title="Load Record #2 from scanned sheet"
              >
                #2
              </button>
              <button
                type="button"
                onClick={() => onLoadSampleRecord(3)}
                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-[11px] font-bold text-white cursor-pointer"
                title="Load Record #3 from scanned sheet"
              >
                #3
              </button>
            </div>
          )}

          {/* Split Screen / Full Screen Toggle */}
          {onToggleSplitView && (
            <button
              type="button"
              onClick={onToggleSplitView}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer ml-1 text-[11px] px-2 font-medium flex items-center gap-1"
              title="Toggle Split-Screen vs Full Form"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <span>{isSplitView ? "Full Screen" : "Split Screen"}</span>
            </button>
          )}

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-red-900/60 text-slate-400 hover:text-red-200 rounded-lg cursor-pointer ml-1"
              title="Close Document View"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Canvas / Viewport */}
      <div
        className="flex-1 bg-slate-800 overflow-hidden relative select-none cursor-grab active:cursor-grabbing flex items-center justify-center p-2"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="transition-transform duration-75 origin-center"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
          }}
        >
          <img
            src={imageSrc}
            alt="Scanned records sheet"
            className="max-w-none shadow-2xl rounded pointer-events-none"
            style={{ maxHeight: "700px" }}
          />
        </div>

        {/* Floating guidance helper */}
        <div className="absolute bottom-2 left-3 bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[10px] px-2.5 py-1 rounded-md border border-slate-700/60 pointer-events-none">
          Click & Drag to pan • Yellow blocks contain record fields
        </div>
      </div>
    </div>
  );
}

