import React from "react";

export default function OperatorToolbar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  accessFilter,
  onAccessFilterChange,
  onExport,
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-xs">
      {/* Search by username/email */}
      <div className="relative flex-1 min-w-[240px]">
        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          id="operator-table-search"
          type="text"
          placeholder="Search by username, email or ID..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-sm placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-2 focus:ring-[#118848]/15 transition-all"
        />
      </div>

      {/* Filter Dropdowns & Export */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Status Dropdown */}
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Frozen</option>
            <option>Denied</option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

        {/* Access Level Dropdown */}
        <div className="relative">
          <select
            value={accessFilter}
            onChange={(e) => onAccessFilterChange(e.target.value)}
            className="appearance-none bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-xl px-4 py-2 pr-9 text-xs sm:text-sm font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
          >
            <option>All Access Level</option>
            <option>Telecom</option>
            <option>Medical</option>
            <option>Both</option>
            <option>Select Level</option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>

        {/* Export Button */}
        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium shadow-2xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </button>
      </div>
    </div>
  );
}

