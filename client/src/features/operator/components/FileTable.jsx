import React, { useState } from "react";
import { Search, Trash2, Download } from "lucide-react";
import ReportDetailsModal from "../../admin/components/details/ReportDetailsModal";
import { downloadAllReportsCsv, downloadSingleReportCsv } from "../../admin/components/details/reportExportUtils";

export default function FileTable({
  level = "medical", // 'medical' or 'telecom'
  admin = "no",
  records = [],
  onDeleteRecord,
  onViewRecord,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
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
    setSelectedRecord(record);
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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
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

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
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

          {/* Download All Records */}
          <button
            type="button"
            onClick={() => downloadAllReportsCsv(filtered, level, "search")}
            disabled={filtered.length === 0}
            className="inline-flex items-center justify-center gap-1.5 bg-[#0e6b38] hover:bg-[#0b542c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer whitespace-nowrap shadow-2xs w-full sm:w-auto"
            title={`Download all ${filtered.length} records as CSV`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All ({filtered.length})</span>
          </button>

          {/* Delete All (Visible only when admin === 'yes') */}
          {admin === "yes" && (
            <button
              type="button"
              onClick={handleDeleteAll}
              className="inline-flex items-center justify-center px-3 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors w-full sm:w-auto"
            >
              Delete All
            </button>
          )}
        </div>
      </div>

      {/* Table - Columns matching exact spec: File No, Record No, Entry Dates, Ref No, Invoice No, Action */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse min-w-[640px]">
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
                          onClick={() => downloadSingleReportCsv(r, level)}
                          className="p-1 text-slate-400 hover:text-emerald-700 rounded cursor-pointer transition-colors"
                          title="Download CSV"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(recNo)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
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

      {/* Full Details Modal */}
      <ReportDetailsModal
        isOpen={!!selectedRecord}
        report={selectedRecord}
        onClose={() => setSelectedRecord(null)}
        onDelete={(recNo) => {
          if (onDeleteRecord) onDeleteRecord(recNo);
          setSelectedRecord(null);
        }}
      />
    </div>
  );
}

