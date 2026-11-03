import React from "react";
import { FileSpreadsheet, Search, Download } from "lucide-react";

export default function OperatorTabs({ activeTab, onTabChange }) {
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
      label: "Download Summary",
      icon: <Download className="w-4 h-4" />,
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onTabChange(tab.id)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
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
  );
}
