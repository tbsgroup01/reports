import React, { useState, useEffect } from "react";
import {
  Search,
  FileSearch,
  Eye,
  Trash2,
  Stethoscope,
  Radio,
  Download,
  CheckCircle2,
  ShieldAlert,
  FileCheck,
  Pencil,
} from "lucide-react";
import ReportDetailsModal from "./ReportDetailsModal";
import {
  downloadAllReportsCsv,
  downloadSingleReportCsv,
} from "./reportExportUtils";

export default function ReportsTab({ operator }) {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reportSearch, setReportSearch] = useState("");
  const [domainFilter, setDomainFilter] = useState("all"); // 'all' | 'medical' | 'telecom'
  const [selectedReport, setSelectedReport] = useState(null);
  const [startInEditMode, setStartInEditMode] = useState(false);
  const [qaBannerMsg, setQaBannerMsg] = useState(null);

  // Approve & Sync entire batch of reports to Master Database
  const handleApproveBatch = async () => {
    try {
      const res = await fetch("https://api.abdivya.com/api/v1/user/qa-batch-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: operator?.id,
          status: "Approved",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReports((prev) => prev.map((r) => ({ ...r, status: "Approved" })));
        setQaBannerMsg("Batch approved! All records audited and synced to master client billing database.");
      }
    } catch (err) {
      alert("Failed to update QA status: " + err.message);
    }
  };

  // Fetch operator's reports from MySQL database
  const fetchReports = async () => {
    if (!operator?.id) return;
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://api.abdivya.com/api/v1/user/get-reports/${operator.id}?limit=100`
      );
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.reports)) {
        setReports(json.data.reports);
      }
    } catch (err) {
      console.warn("Error fetching operator reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();

    // Connect to real-time updates so newly saved reports appear instantly
    let eventSource = null;
    try {
      eventSource = new EventSource("https://api.abdivya.com/api/admin/operators/stream");
      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === "REPORT_SAVED" || data.type === "REPORT_DELETED") {
            if (!data.extra?.userId || String(data.extra?.userId) === String(operator?.id)) {
              fetchReports();
            }
          }
        } catch (err) {
          console.warn("SSE parse error in ReportsTab:", err);
        }
      };
    } catch (e) {
      console.warn("SSE connection error in ReportsTab:", e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [operator?.id]);

  // Delete individual report from database
  const handleDeleteReport = async (reportId) => {
    if (confirm("Are you sure you want to delete this submitted report from the database?")) {
      try {
        const res = await fetch(`https://api.abdivya.com/api/v1/user/reports/${reportId}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          setReports((prev) => prev.filter((r) => r.id !== reportId && r._id !== reportId));
          alert("Report deleted successfully from database.");
        }
      } catch (err) {
        alert("Failed to delete report: " + err.message);
      }
    }
  };

  // Filter reports
  const filteredReports = reports.filter((r) => {
    const term = reportSearch.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (r.fileNo && r.fileNo.toLowerCase().includes(term)) ||
      (r.recordNo && r.recordNo.toLowerCase().includes(term)) ||
      (r.invoiceNo && r.invoiceNo.toLowerCase().includes(term)) ||
      (r.customerName && r.customerName.toLowerCase().includes(term));

    const matchesDomain =
      domainFilter === "all" ||
      (r.level && r.level.toLowerCase() === domainFilter.toLowerCase());

    return matchesSearch && matchesDomain;
  });

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs  font-semibold w-fit">
          <button
            type="button"
            onClick={() => setDomainFilter("all")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${domainFilter === "all"
              ? "bg-white text-slate-900 shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            All Reports ({reports.length})
          </button>
          <button
            type="button"
            onClick={() => setDomainFilter("medical")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${domainFilter === "medical"
              ? "bg-[#0e6b38] text-white shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Medical ({reports.filter((r) => r.level === "medical").length})</span>
          </button>
          <button
            type="button"
            onClick={() => setDomainFilter("telecom")}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${domainFilter === "telecom"
              ? "bg-[#0e6b38] text-white shadow-2xs font-bold"
              : "text-slate-600 hover:text-slate-900"
              }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Telecom ({reports.filter((r) => r.level === "telecom").length})</span>
          </button>
        </div>

        {/* Search & Download All Group */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto flex-wrap">
          <div className="relative flex-1 sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by file, record, invoice..."
              value={reportSearch || ""}
              onChange={(e) => setReportSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs  placeholder-slate-400 text-slate-800 focus:outline-none focus:border-[#118848]"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              downloadAllReportsCsv(
                filteredReports,
                operator?.username || "operator",
                domainFilter
              )
            }
            disabled={filteredReports.length === 0}
            className="inline-flex items-center gap-1.5 bg-[#0e6b38] hover:bg-[#0b542c] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-3.5 py-1.5 rounded-xl text-xs  shadow-2xs transition-all cursor-pointer whitespace-nowrap"
            title={`Download ${filteredReports.length} reports in CSV format`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download All ({filteredReports.length})</span>
          </button>
        </div>
      </div>

      {/* Quality Assurance (QA) Checkpoint Audit Banner */}
      {filteredReports.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50/90 via-slate-50 to-emerald-50/70 border border-amber-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs  sm:text-xs m font-bold text-slate-900">
                  Quality Assurance (QA) Checkpoint
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                  Audit Staging
                </span>
              </div>
              <p className="text-[11px] text-slate-600 mt-0.5">
                Review and verify operator sheets before syncing to the master client billing database.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleApproveBatch}
            className="inline-flex items-center gap-1.5 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-4 py-2 rounded-xl text-xs  transition-all cursor-pointer shadow-xs shrink-0"
            title="Approve and sync batch to master client billing database"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>Approve & Sync to Master DB</span>
          </button>
        </div>
      )}

      {/* QA Feedback Message */}
      {qaBannerMsg && (
        <div className="p-3.5 rounded-xl text-xs  font-semibold flex items-center justify-between gap-2 bg-emerald-50 text-emerald-900 border border-emerald-200 animate-tab-fade">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{qaBannerMsg}</span>
          </div>
          <button
            type="button"
            onClick={() => setQaBannerMsg(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Reports Table or Empty State */}
      {isLoading ? (
        <div className="py-12 text-center text-xs  text-slate-500 font-medium">
          Loading saved reports from database...
        </div>
      ) : filteredReports.length === 0 ? (
        <div className="py-12 sm:py-16 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-4 rounded-2xl bg-[#e3f4e8] text-[#118848] flex items-center justify-center shadow-xs">
            <FileSearch className="w-8 h-8" />
          </div>
          <h4 className="text-lg font-bold text-slate-900 mb-1">No reports found</h4>
          <p className="text-xs m text-slate-500 max-w-sm">
            {reportSearch
              ? "No records matched your search filter."
              : `Operator "${operator?.username || "user"}" has not submitted any reports yet.`}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full text-left text-xs  border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-200">
                <th className="py-3 px-3">Record No</th>
                <th className="py-3 px-3">File No</th>
                <th className="py-3 px-3">Domain</th>
                <th className="py-3 px-3">Entry Date</th>
                <th className="py-3 px-3">Invoice No</th>
                <th className="py-3 px-3">Customer / Agent</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
              {filteredReports.map((report) => {
                const isMed = report.level === "medical";
                return (
                  <tr key={report.id || report._id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Record No */}
                    <td className="py-3 px-3 font-bold text-emerald-800 font-mono">
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="hover:underline cursor-pointer text-left"
                        title="Click to view full record inspection"
                      >
                        {report.recordNo || "—"}
                      </button>
                    </td>

                    {/* File No */}
                    <td className="py-3 px-3.5 text-slate-800 font-mono" title={report.fileNo}>
                      {report.fileNo || "—"}
                    </td>

                    {/* Domain Badge */}
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${isMed
                          ? "bg-emerald-50 text-[#0e6b38] border border-emerald-200"
                          : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                      >
                        {isMed ? <Stethoscope className="w-3 h-3" /> : <Radio className="w-3 h-3" />}
                        <span className="capitalize">{report.level || "medical"}</span>
                      </span>
                    </td>

                    {/* Entry Date */}
                    <td className="py-3 px-3.5 text-slate-600 whitespace-nowrap">
                      {report.entryDate || "—"}
                    </td>

                    {/* Invoice No */}
                    <td className="py-3 px-3.5 font-mono text-slate-800" title={report.invoiceNo}>
                      {report.invoiceNo || "—"}
                    </td>

                    {/* Customer Name */}
                    <td className="py-3 px-3.5" title={report.customerName || report.custName}>
                      <div className="font-semibold text-slate-900">
                        {report.customerName || report.custName || "—"}
                      </div>
                      {report.agentName && (
                        <div className="text-[11px] text-slate-400">Agent: {report.agentName}</div>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-3.5 font-bold text-slate-900 font-mono text-xs ">
                      ${report.total || report.netAmount || "0.00"}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3.5">
                      {report.status === "Approved" || report.status === "Approved & Synced" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0e6b38] border border-emerald-300 shadow-2xs">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved & Synced</span>
                        </span>
                      ) : report.status === "Pending QA" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                          <span>Pending QA</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {report.status || "Digitized"}
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3.5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(report);
                            setStartInEditMode(true);
                          }}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0e6b38] rounded-lg cursor-pointer transition-colors"
                          title="Edit Report Data"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadSingleReportCsv(report, operator?.username || "operator")}
                          className="p-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="Download Individual Report (CSV)"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedReport(report);
                            setStartInEditMode(false);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteReport(report.id || report._id)}
                          className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg cursor-pointer transition-colors"
                          title="Delete Report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Full Details Inspection & Edit Modal */}
      <ReportDetailsModal
        isOpen={!!selectedReport}
        report={selectedReport}
        operator={operator}
        startInEditMode={startInEditMode}
        onClose={() => {
          setSelectedReport(null);
          setStartInEditMode(false);
        }}
        onDelete={(id) => handleDeleteReport(id)}
        onUpdate={(updated) => {
          setReports((prev) =>
            prev.map((r) =>
              (r.id && r.id === updated.id) ||
                (r._id && r._id === updated.id) ||
                (r.recordNo && r.recordNo === updated.recordNo)
                ? { ...r, ...updated }
                : r
            )
          );
          setSelectedReport(updated);
        }}
      />
    </div>
  );
}
