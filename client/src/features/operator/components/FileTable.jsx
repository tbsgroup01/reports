import React, { useState } from "react";

export default function FileTable({
  level = "medical", // 'medical' or 'telecom'
  admin = "no",
  records = [],
  onDeleteRecord,
  onViewRecord,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Filter records based on search
  const filtered = records.filter((r) => {
    const q = searchTerm.toLowerCase();
    const fileNo = (r.fileNo || r["File No"] || "").toLowerCase();
    const recNo = (r.recordNo || r["Record No"] || "").toLowerCase();
    const invNo = (r.invoiceNo || r["invoice no"] || r["Invoice No"] || "").toLowerCase();
    const refNo = (r.refNo || r["Ref No"] || "").toLowerCase();
    return fileNo.includes(q) || recNo.includes(q) || invNo.includes(q) || refNo.includes(q);
  });

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIndex, startIndex + itemsPerPage);

    const handleDelete = (recNo) => {
    if (confirm(`Delete record ${recNo}?`)) {
      if (onDeleteRecord) onDeleteRecord(recNo);
    }
  };

  const handleView = (record) => {
    if (onViewRecord) {
      onViewRecord(record);
      return;
    }
    const recNo = record.recordNo || record["Record No"] || "1";
    let target = `/user-medical-report/${recNo}`;
    if (admin === "yes" && level === "medical") {
      target = `/admin-medical-report/${recNo}`;
    } else if (admin === "yes" && level === "telecom") {
      target = `/admin-telecom-report/${recNo}`;
    } else if (admin === "no" && level === "telecom") {
      target = `/user-telecom-report/${recNo}`;
    }
    window.history.pushState({}, "", target);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete ALL records? This action cannot be undone.")) {
      filtered.forEach((r) => {
        const id = r.recordNo || r["Record No"];
        if (onDeleteRecord) onDeleteRecord(id);
      });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-5 sm:p-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h3 className="text-base font-bold text-slate-900 capitalize">
            {level} Digitized Records Search
          </h3>
          <p className="text-xs text-slate-500">
            Search and manage indexed {level} documents by file, invoice, or record number.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Search File, Record, Ref No..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
            />
          </div>

          {/* Delete All (Visible only when admin === 'yes') */}
          {admin === "yes" && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors"
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Table - Columns matching exact spec: File No, Record No, Entry Dates, Ref No, Invoice No, Action */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-600 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3.5">File No</th>
              <th className="py-3 px-3.5">Record No</th>
              <th className="py-3 px-3.5">Entry Dates</th>
              <th className="py-3 px-3.5">Ref No</th>
              <th className="py-3 px-3.5">Invoice No</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-10 text-center text-slate-400">
                  No {level} records found matching your query.
                </td>
              </tr>
            ) : (
              paginated.map((r, idx) => {
                const fileNo = r.fileNo || r["File No"] || "—";
                const recNo = r.recordNo || r["Record No"] || `#${idx + 1}`;
                const entryDate = r.entryDate || r["Entry Date"] || r["Entry Dates"] || r["Invoice date"] || "2026-11-03";
                const refNo = r.refNo || r["Ref No"] || (level === "telecom" ? r["Device Name"] || "TC-REF" : "Mb_Sales-Med-Np#-l44604");
                const invoiceNo = r.invoiceNo || r["invoice no"] || r["Invoice No"] || "—";

                return (
                  <tr key={recNo + idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 font-medium text-slate-800">{fileNo}</td>
                    <td className="py-3 px-3.5 font-semibold text-emerald-700">{recNo}</td>
                    <td className="py-3 px-3.5 text-slate-600">{entryDate}</td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-600 truncate max-w-[200px]" title={refNo}>
                      {refNo}
                    </td>
                    <td className="py-3 px-3.5 font-mono text-[11px] text-slate-700">{invoiceNo}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleView(r)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#118848] bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(recNo)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Showing {filtered.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length} entries
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 border border-slate-200 rounded-lg disabled:opacity-40 cursor-pointer hover:bg-slate-50"
          >
            Previous
          </button>
          <span className="px-2 font-semibold text-slate-800">
            {currentPage} / {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 border border-slate-200 rounded-lg disabled:opacity-40 cursor-pointer hover:bg-slate-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

