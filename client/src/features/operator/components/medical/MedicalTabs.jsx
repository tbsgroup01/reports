import React, { useState } from "react";
import WorkTab from "./WorkTab";
import FileTable from "../FileTable";
import DownloadReport from "../DownloadReport";
import TodaysReport from "../TodaysReport";
import { Search, Download, Database, FileText } from "lucide-react";

export default function MedicalTabs({
  admin = "no",
  records = [],
  onSaveRecord,
  onDeleteRecord,
  duplicateReportEnabled = false,
  jumbleUpReports = false,
  imageSrc,
  imageName,
  onOpenImageModal,
}) {
  const [activeView, setActiveView] = useState("work");

  return (
    <div className="space-y-3">
      {/* 1. Primary Navigation Tabs - Left-aligned with cool modern pill transitions */}
      <div className="w-full overflow-x-auto no-scrollbar pb-1">
        <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200/90 shadow-2xs whitespace-nowrap min-w-max">
          <button
            type="button"
            onClick={() => setActiveView("work")}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === "work"
                ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Work Tab</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("search")}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === "search"
                ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search Records</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("download")}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === "download"
                ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView("backup")}
            className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              activeView === "backup"
                ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
            }`}
          >
            <Database className="w-4 h-4" />
            <span>Backup</span>
          </button>
        </div>
      </div>

      {/* 2. Content View with smooth fade-in animation */}
      <div key={activeView} className="animate-tab-fade">
        {activeView === "work" && (
          <WorkTab
            domain="medical"
            onSaveRecord={onSaveRecord}
            duplicateReportEnabled={duplicateReportEnabled}
            jumbleUpReports={jumbleUpReports}
            imageSrc={imageSrc}
            imageName={imageName}
            onOpenImageModal={onOpenImageModal}
          />
        )}

        {activeView === "search" && (
          <FileTable
            level="medical"
            admin={admin}
            records={records}
            onDeleteRecord={onDeleteRecord}
            jumbleUpReports={jumbleUpReports}
            duplicateReports={duplicateReportEnabled}
          />
        )}

        {activeView === "download" && (
          <DownloadReport level="medical" records={records} />
        )}

        {activeView === "backup" && (
          <TodaysReport level="medical" records={records} />
        )}
      </div>
    </div>
  );
}
