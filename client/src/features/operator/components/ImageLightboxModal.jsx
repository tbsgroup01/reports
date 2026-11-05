import React, { useState, useEffect } from "react";
import { ZoomIn, ZoomOut, RotateCcw, X, Eye, Maximize2 } from "lucide-react";

export default function ImageLightboxModal({
  isOpen,
  imageSrc,
  imageName = "sample-scanned-doc.jpg",
  onClose,
}) {
  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Reset zoom on open
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Zoom handlers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 4));
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 rounded-2xl sm:rounded-3xl border border-slate-700 shadow-2xl max-w-5xl w-full h-[92vh] sm:h-[90vh] flex flex-col overflow-hidden transition-all">

        {/* Modal Toolbar */}
        <div className="bg-slate-950 text-white px-3 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-3 text-xs  border-b border-slate-800 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-slate-100 flex items-center gap-1.5 text-xs  sm:text-xs m">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>Document Inspector</span>
            </span>
            <span className="text-emerald-300 font-mono text-[11px] sm:text-xs  px-2 py-0.5 bg-emerald-950/80 border border-emerald-800/80 rounded truncate max-w-[120px] sm:max-w-[240px]" title={imageName}>
              {imageName}
            </span>
          </div>

          {/* Controls: Zoom, Reset, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>

            <span className="px-2 sm:px-2.5 py-1 bg-slate-800 rounded-lg font-mono text-xs  text-emerald-400 font-bold min-w-[44px] sm:min-w-[50px] text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-200 cursor-pointer text-xs  px-2 sm:px-2.5 font-medium flex items-center gap-1 transition-colors"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <div className="h-4 sm:h-5 w-px bg-slate-700 mx-0.5 sm:mx-1"></div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 sm:p-1.5 bg-slate-800 hover:bg-red-600/80 text-slate-300 hover:text-white rounded-lg cursor-pointer transition-colors flex items-center gap-1 px-2 sm:px-2.5 font-semibold text-xs "
              title="Close Modal (Esc)"
            >
              <X className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
              <span className="hidden sm:inline">Close</span>
            </button>
          </div>
        </div>

        {/* Viewport with Pan and Zoom */}
        <div
          className="flex-1 bg-slate-950 overflow-hidden relative select-none cursor-grab active:cursor-grabbing flex items-center justify-center p-2 sm:p-4"
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
              alt="Scanned Sheet Full View"
              className="max-w-none shadow-2xl rounded pointer-events-none border border-slate-700"
              style={{ maxHeight: "78vh" }}
            />
          </div>

          {/* Floating guidance helper */}
          <div className="hidden sm:flex absolute bottom-3 left-4 bg-slate-900/90 backdrop-blur-xs text-slate-300 text-xs  px-3.5 py-1.5 rounded-xl border border-slate-700/60 pointer-events-none items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Click & Drag to pan • Use Zoom controls above to read small print • Esc to close</span>
          </div>
        </div>

      </div>
    </div>
  );
}

