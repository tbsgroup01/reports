import SessionTimer from "../SessionTimer";
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
 onUpdateRecord,
 duplicateReportEnabled = false,
 jumbleUpReports = false,
 userId,
 imageSrc,
 imageName,
 onOpenImageModal,
 onImageSelect,
}) {
 const [activeView, setActiveView] = useState("work");

 return (
 <div className="space-y-1.5">
 {/* 1. Primary Navigation Tabs - Left-aligned with cool modern pill transitions */}
 <div className="flex items-center justify-between gap-2.5 flex-wrap pb-0.5">
        <div className="inline-flex items-center p-0.5 bg-slate-100/90 rounded-xl border border-slate-200/90 shadow-2xs whitespace-nowrap min-w-max">
 <button
 type="button"
 onClick={() => setActiveView("work")}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${activeView === "work"
 ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
 : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
 }`}
 >
 <FileText className="w-3.5 h-3.5" />
 <span>Work Tab</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveView("search")}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${activeView === "search"
 ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
 : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
 }`}
 >
 <Search className="w-3.5 h-3.5" />
 <span>Search Records</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveView("download")}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${activeView === "download"
 ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
 : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
 }`}
 >
 <Download className="w-3.5 h-3.5" />
 <span>Download</span>
 </button>

 <button
 type="button"
 onClick={() => setActiveView("backup")}
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[12px] font-semibold transition-all duration-200 cursor-pointer ${activeView === "backup"
 ? "bg-[#0e6b38] text-white shadow-xs font-bold scale-[1.02]"
 : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
 }`}
 >
 <Database className="w-3.5 h-3.5" />
 <span>Backup</span>
 </button>
 </div>

  {/* Session Time Counter & Tracker */}
  <SessionTimer />
  </div>

 {/* 2. Content View with smooth fade-in animation */}
 <div key={activeView} className="animate-tab-fade">
 {activeView === "work" && (
 <WorkTab
 domain="medical"
 onSaveRecord={onSaveRecord}
 duplicateReportEnabled={duplicateReportEnabled}
 jumbleUpReports={jumbleUpReports}
 userId={userId}
 imageSrc={imageSrc}
 imageName={imageName}
 onOpenImageModal={onOpenImageModal}
 onImageSelect={onImageSelect}
 />
 )}

 {activeView === "search" && (
 <FileTable
 level="medical"
 admin={admin}
 records={records}
 onDeleteRecord={onDeleteRecord}
 onUpdateRecord={onUpdateRecord}
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
