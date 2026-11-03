import React, { useState } from "react";
import WorkTab from "./WorkTab";
import FileTable from "../FileTable";
import DownloadReport from "../DownloadReport";
import TodaysReport from "../TodaysReport";
import { FileSpreadsheet, Search, Download, Database } from "lucide-react";

export default function MedicalTabs({
  admin = "no",
  records = [],
  onSaveRecord,
  onDeleteRecord,
  duplicateReportEnabled = false,
  jumbleUpReports = false,
}) {
  const [activeTab, setActiveTab] = useState("work");

  const tabs = [
    {
      id: "work",
      label: "Work Tab",
      icon: <FileSpreadsheet className="w-4 h-4" />,
    },
    {
      id: "search",
      label: "Search",
      icon: <Search className="w-4 h-4" />,
    },
    {
      id: "download",
      label: "Download",
      icon: <Download className="w-4 h-4" />,
    },
    {
      id: "backup",
      label: "Backup",
      icon: <Database className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${isActive
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-50 border border-slate-200"
                }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Views */}
      {activeTab === "work" && (
        <WorkTab
          onSaveRecord={onSaveRecord}
          duplicateReportEnabled={duplicateReportEnabled}
          jumbleUpReports={jumbleUpReports}
        />
      )}

      {activeTab === "search" && (
        <FileTable
          level="medical"
          admin={admin}
          records={records}
          onDeleteRecord={onDeleteRecord}
          jumbleUpReports={jumbleUpReports}
          duplicateReports={duplicateReportEnabled}
        />
      )}

      {activeTab === "download" && (
        <DownloadReport
          level="medical"
          records={records}
        />
      )}

      {activeTab === "backup" && (
        <TodaysReport
          level="medical"
          records={records}
        />
      )}
    </div>
  );
}
