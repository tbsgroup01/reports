import React, { useState, useRef } from "react";
import sampleDocImg from "../../../assets/sample-scanned-doc.jpg";
import { ZoomIn, ZoomOut, RotateCcw, Columns2, Maximize2, X, Eye } from "lucide-react";

export default function DocumentViewer({
  customImageSrc,
  imageName = "sample-scanned-doc.jpg",
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
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 3.5));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.4));
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden flex flex-col h-full min-h-[380px] max-h-[600px] transition-all">
      {/* Viewer Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between gap-3 text-xs  flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-bold text-slate-100 flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Document Preview:</span>
          </span>
          <span className="text-emerald-300 font-mono text-[11px] truncate max-w-[200px]" title={imageName}>
            {imageName}
          </span>
        </div>

        {/* Controls: Zoom, Reset, Split/Full, Close */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <span className="px-2 py-1 bg-slate-800 rounded-lg font-mono text-[11px] text-emerald-400 font-bold min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleResetZoom}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer text-[11px] px-2 font-medium flex items-center gap-1 transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>

          {/* Quick Sample Selector */}
          {onLoadSampleRecord && (
            <div className="flex items-center gap-1 border-l border-slate-700 pl-2 ml-1">
              <span className="text-[11px] text-slate-400 hidden sm:inline">Fill:</span>
              <button
                type="button"
                onClick={() => onLoadSampleRecord(1)}
                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-[11px] font-bold text-white cursor-pointer"
                title="Load Record #1 values"
              >
                #1
              </button>
              <button
                type="button"
                onClick={() => onLoadSampleRecord(2)}
                className="px-2 py-1 bg-emerald-700 hover:bg-emerald-600 rounded text-[11px] font-bold text-white cursor-pointer"
                title="Load Record #2 values"
              >
                #2
              </button>
            </div>
          )}

          {/* Split Screen / Full Screen Toggle */}
          {onToggleSplitView && (
            <button
              type="button"
              onClick={onToggleSplitView}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer ml-1 text-[11px] px-2.5 font-medium flex items-center gap-1.5 transition-colors"
              title="Toggle Split-Screen vs Full Form"
            >
              {isSplitView ? <Maximize2 className="w-3.5 h-3.5" /> : <Columns2 className="w-3.5 h-3.5" />}
              <span>{isSplitView ? "Full Form" : "Split View"}</span>
            </button>
          )}

          {/* Close button */}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 hover:bg-red-900/60 text-slate-400 hover:text-red-200 rounded-lg cursor-pointer ml-1 transition-colors"
              title="Hide Document Preview"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Canvas / Viewport */}
      <div
        className="flex-1 bg-slate-950 overflow-hidden relative select-none cursor-grab active:cursor-grabbing flex items-center justify-center p-3"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ minHeight: "320px" }}
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
            className="max-w-none shadow-2xl rounded pointer-events-none border border-slate-700"
            style={{ maxHeight: "550px" }}
          />
        </div>

        {/* Floating guidance helper */}
        <div className="absolute bottom-2 left-3 bg-slate-900/90 backdrop-blur-xs text-slate-300 text-[10px] px-3 py-1 rounded-md border border-slate-700/60 pointer-events-none flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Click & Drag to pan • Use Zoom controls above to read fields</span>
        </div>
      </div>
    </div>
  );
}
