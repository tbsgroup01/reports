import React, { useState, useMemo } from "react";
import { Search, Trash2, Download, Eye, Layers, Pencil } from "lucide-react";
import ReportDetailsModal from "../../admin/components/details/ReportDetailsModal";
import { downloadAllReportsCsv, downloadSingleReportCsv } from "../../admin/components/details/reportExportUtils";
import { formatRecordNumber } from "../../../utils/recordNumberUtils";

const formatEntryTime = (timestamp) => {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

// Exact sequence of Medical fields (Notebook 1 - 21 inputs + totals):
export const MEDICAL_FIELD_SEQUENCE = [
  { key: "fileNo", label: "File No", width: "min-w-[190px]" },
  { key: "recordNo", label: "Record No", width: "min-w-[140px]", isHighlight: true },
  { key: "entryDate", label: "Entry Date", width: "min-w-[120px]" },
  { key: "entryTime", label: "Entry Time", width: "min-w-[120px]" },
  { key: "refNo", label: "Ref No", width: "min-w-[240px]" },
  { key: "invoiceNo", label: "Invoice No", width: "min-w-[150px]" },
  { key: "courierName", label: "Courier Name", width: "min-w-[150px]" },
  { key: "conNo", label: "CON No", width: "min-w-[140px]" },
  { key: "dispatchDate", label: "Dispatch Date", width: "min-w-[150px]" },
  { key: "dispatchBy", label: "Dispatch By", width: "min-w-[150px]" },
  { key: "salesDate", label: "Sales Date", width: "min-w-[130px]" },
  { key: "salesTime", label: "Sales Time", width: "min-w-[120px]" },
  { key: "customerName", label: "Customer Name", width: "min-w-[180px]" },
  { key: "emailAddress", label: "Email Address", width: "min-w-[200px]" },
  { key: "agentName", label: "Agent Name", width: "min-w-[150px]" },
  { key: "address", label: "Address", width: "min-w-[240px]" },
  { key: "city", label: "City", width: "min-w-[130px]" },
  { key: "state", label: "State", width: "min-w-[100px]" },
  { key: "zip", label: "Zip", width: "min-w-[100px]" },
  { key: "customerPhone", label: "Customer Phone", width: "min-w-[150px]" },
  { key: "creditCardType", label: "Credit Card Type", width: "min-w-[190px]" },
  { key: "creditCardNo", label: "Credit Card No", width: "min-w-[180px]" },
  { key: "total", label: "Total", width: "min-w-[120px]", isCurrency: true },
  { key: "discount", label: "Discount", width: "min-w-[120px]", isCurrency: true },
  { key: "netAmount", label: "Net Amount", width: "min-w-[130px]", isCurrency: true },
];

// Exact sequence of Telecom fields (Notebook 2 - 33 inputs):
// Row 1: File no | Record no | Invoice no
// Row 2: Invoice date | Phone no | Price Plans
// Row 3: Device name | Phone cost | Monthly cost
// Row 4: MMS | Texts | Extra value
// Row 5: Customer Type | Customer Name | Initials
// Row 6: Company name | Customer Address | Email
// Row 7: City | State | Zip
// Row 8: Residence type | Agent no | Agent name
// Row 9: Agency code | Agency name | Deposit
// Row 10: Balance | Credit card type | Card no
// Row 11: Card Expiry date | Credit rate | Remark
export const TELECOM_FIELD_SEQUENCE = [
  // Row 1
  { key: "fileNo", label: "File No", width: "min-w-[190px]" },
  { key: "recordNo", label: "Record No", width: "min-w-[140px]", isHighlight: true },
  { key: "invoiceNo", label: "Invoice No", width: "min-w-[150px]" },
  // Row 2
  { key: "invoiceDate", label: "Invoice Date", width: "min-w-[120px]" },
  { key: "phoneNo", label: "Phone No", width: "min-w-[150px]" },
  { key: "pricePlans", label: "Price Plans", width: "min-w-[200px]" },
  // Row 3
  { key: "deviceName", label: "Device Name", width: "min-w-[220px]" },
  { key: "phoneCost", label: "Phone Cost", width: "min-w-[120px]", isCurrency: true },
  { key: "monthlyCost", label: "Monthly Cost", width: "min-w-[130px]", isCurrency: true },
  // Row 4
  { key: "mms", label: "MMS", width: "min-w-[110px]" },
  { key: "texts", label: "Texts", width: "min-w-[110px]" },
  { key: "extraValueIncluded", label: "Extra Value", width: "min-w-[200px]" },
  // Row 5
  { key: "customerType", label: "Customer Type", width: "min-w-[140px]" },
  { key: "customerName", label: "Customer Name", width: "min-w-[180px]" },
  { key: "initials", label: "Initials", width: "min-w-[90px]" },
  // Row 6
  { key: "companyName", label: "Company Name", width: "min-w-[170px]" },
  { key: "address", label: "Customer Address", width: "min-w-[240px]" },
  { key: "emailAddress", label: "Email", width: "min-w-[200px]" },
  // Row 7
  { key: "city", label: "City", width: "min-w-[130px]" },
  { key: "state", label: "State", width: "min-w-[100px]" },
  { key: "zip", label: "Zip", width: "min-w-[100px]" },
  // Row 8
  { key: "residenceType", label: "Residence Type", width: "min-w-[140px]" },
  { key: "agentNo", label: "Agent No", width: "min-w-[130px]" },
  { key: "agentName", label: "Agent Name", width: "min-w-[160px]" },
  // Row 9
  { key: "agencyCode", label: "Agency Code", width: "min-w-[130px]" },
  { key: "agencyName", label: "Agency Name", width: "min-w-[170px]" },
  { key: "deposit", label: "Deposit", width: "min-w-[120px]", isCurrency: true },
  // Row 10
  { key: "balance", label: "Balance", width: "min-w-[120px]", isCurrency: true },
  { key: "creditCardType", label: "Credit Card Type", width: "min-w-[190px]" },
  { key: "creditCardNo", label: "Card No", width: "min-w-[180px]" },
  // Row 11
  { key: "cardExpiryDate", label: "Card Expiry Date", width: "min-w-[140px]" },
  { key: "creditRate", label: "Credit Rate", width: "min-w-[130px]" },
  { key: "remark", label: "Remark", width: "min-w-[250px]" },
];

export const WORKTAB_FIELD_SEQUENCE = MEDICAL_FIELD_SEQUENCE;

export default function FileTable({
  level = "medical", // 'medical' or 'telecom'
  admin = "no",
  records = [],
  onDeleteRecord,
  onUpdateRecord,
  onViewRecord,
}) {
  const isTelecom = level === "telecom";
  const activeSequence = isTelecom ? TELECOM_FIELD_SEQUENCE : MEDICAL_FIELD_SEQUENCE;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [startInEditMode, setStartInEditMode] = useState(false);
  const itemsPerPage = 8;

  // Search across ALL entered fields so search never misses any detail
  const filtered = useMemo(() => {
    if (!Array.isArray(records)) return [];
    if (!searchTerm || !searchTerm.trim()) return records;

    const q = searchTerm.toLowerCase().trim();
    return records.filter((r) => {
      // Check every string/number attribute on the record
      return Object.values(r).some((val) => {
        if (val === null || val === undefined || typeof val === "object") return false;
        return String(val).toLowerCase().includes(q);
      });
    });
  }, [records, searchTerm]);

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
    setStartInEditMode(false);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setStartInEditMode(true);
  };

  const handleDeleteAll = () => {
    if (confirm("Are you sure you want to delete ALL records? This action cannot be undone.")) {
      filtered.forEach((r) => {
        const id = r.recordNo || r["Record No"];
        if (onDeleteRecord) onDeleteRecord(id);
      });
    }
  };

  // Helper to extract value with fallback keys
  const getFieldValue = (r, colKey) => {
    switch (colKey) {
      case "fileNo":
        return r.fileNo || r["File No"] || "";
      case "recordNo":
        return formatRecordNumber(r.recordNo || r["Record No"] || "");
      case "invoiceNo":
        return r.invoiceNo || r["Invoice No"] || r["invoice no"] || "";
      case "invoiceDate":
        return r.invoiceDate || r.entryDate || r["Invoice Date"] || "";
      case "phoneNo":
        return r.phoneNo || r.customerPhone || "";
      case "pricePlans":
        return r.pricePlans || "";
      case "deviceName":
        return r.deviceName || "";
      case "phoneCost":
        return r.phoneCost || "";
      case "monthlyCost":
        return r.monthlyCost || "";
      case "mms":
        return r.mms || "";
      case "texts":
        return r.texts || "";
      case "extraValueIncluded":
        return r.extraValueIncluded || r.extraValue || "";
      case "customerType":
        return r.customerType || "";
      case "customerName":
        return r.customerName || r.custName || r["Customer Name"] || "";
      case "initials":
        return r.initials || "";
      case "companyName":
        return r.companyName || "";
      case "address":
        return r.address || r.customerAddress || r.custAddress || "";
      case "emailAddress":
        return r.emailAddress || r.email || "";
      case "city":
        return r.city || r["City"] || "";
      case "state":
        return r.state || r["State"] || "";
      case "zip":
        return r.zip || r["Zip"] || r.pin || "";
      case "residenceType":
        return r.residenceType || "";
      case "agentNo":
        return r.agentNo || "";
      case "agentName":
        return r.agentName || r["Agent Name"] || "";
      case "agencyCode":
        return r.agencyCode || "";
      case "agencyName":
        return r.agencyName || "";
      case "deposit":
        return r.deposit || "";
      case "balance":
        return r.balance || "";
      case "cardExpiryDate":
        return r.cardExpiryDate || "";
      case "creditRate":
        return r.creditRate || "";
      case "remark":
        return r.remark || "";
      case "accountNo":
        return r.accountNo || r["Account No"] || r.phoneNo || "";
      case "entryDate":
        return r.entryDate || r["Entry Date"] || r["Entry Dates"] || r.createdAt?.split("T")[0] || "";
      case "entryTime":
        return r.entryTime || formatEntryTime(r.createdAt || r.timestamp);
      case "courierName":
        return r.courierName || r["Courier Name"] || r.accountNo || "";
      case "conNo":
        return r.conNo || r["CON No"] || "";
      case "dispatchNo":
        return r.dispatchNo || r["Dispatch No"] || "";
      case "dispatchDate":
        return r.dispatchDate || r["Dispatch Date"] || "";
      case "dispatchBy":
        return r.dispatchBy || r["Dispatch By"] || "";
      case "salesDate":
        return r.salesDate || r["Sales Date"] || "";
      case "salesTime":
        return r.salesTime || r["Sales Time"] || "";
      case "refNo":
        return r.refNo || r["Ref No"] || "";
      case "pin":
        return r.pin || "";
      case "customerPhone":
        return r.customerPhone || r.phoneNo || "";
      case "expirationRemark":
        return r.expirationRemark || r.remark || "";
      case "status":
        return r.status || "";
      case "creditCardType":
        return r.creditCardType || "";
      case "creditCardNo":
        return r.creditCardNo || "";
      case "total":
        return r.total || r.phoneCost || "";
      case "discount":
        return r.discount || "";
      case "netAmount":
        return r.netAmount || r.balance || "";
      default:
        return r[colKey] || "";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden space-y-4 p-4 sm:p-6">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-slate-900 capitalize">
              {level} Digitized Records Search
            </h3>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#0e6b38] border border-emerald-200">
              <Layers className="w-3 h-3 text-[#0e6b38]" />
              Exact {isTelecom ? "Telecom (33 Fields)" : "Medical (21 Fields)"} Order
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            All fields are displayed in the exact sequence as entered in the {isTelecom ? "Telecom" : "Medical"} Work Tab notebook sequence.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search by any field (File, Record, Customer, Invoice)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
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

      {/* Complete Table in Exact WorkTab Entry Sequence */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-2xs">
        <table className="w-full text-left text-xs border-collapse min-w-[2400px]">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px] tracking-wider whitespace-nowrap">
              {activeSequence.map((col, cIdx) => (
                <th
                  key={col.key}
                  className={`py-3 px-3.5 ${col.width} ${
                    col.isHighlight ? "bg-emerald-50 text-[#0e6b38] border-x border-emerald-200/80" : ""
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-slate-200/90 text-slate-600 flex items-center justify-center text-[9px] font-bold">
                      {cIdx + 1}
                    </span>
                    <span>{col.label}</span>
                  </span>
                </th>
              ))}
              {/* Sticky Action Column on Right */}
              <th className="py-3 px-4 text-center sticky right-0 bg-slate-100/95 backdrop-blur-xs border-l border-slate-200 shadow-[-6px_0_12px_rgba(0,0,0,0.06)] min-w-[140px] z-10">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
            {paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={activeSequence.length + 1}
                  className="py-12 text-center text-slate-400 font-medium"
                >
                  No {level} records found matching your query.
                </td>
              </tr>
            ) : (
              paginated.map((r, idx) => {
                const recNo = r.recordNo || r["Record No"] || `#${idx + 1}`;

                return (
                  <tr key={recNo + idx} className="hover:bg-slate-50/80 transition-colors whitespace-nowrap">
                    {activeSequence.map((col) => {
                      const val = getFieldValue(r, col.key, idx);

                      if (col.isHighlight) {
                        return (
                          <td
                            key={col.key}
                            className="py-3 px-3.5 font-mono font-bold text-[#0e6b38] bg-emerald-50/40 border-x border-emerald-200/60"
                          >
                            {val}
                          </td>
                        );
                      }

                      if (col.isBadge) {
                        return (
                          <td key={col.key} className="py-3 px-3.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-[#0e6b38] border border-emerald-300">
                              {val}
                            </span>
                          </td>
                        );
                      }

                      if (col.isCurrency) {
                        return (
                          <td key={col.key} className="py-3 px-3.5 font-mono font-bold text-slate-900">
                            {parseFloat(val || 0).toFixed(2)}
                          </td>
                        );
                      }

                      return (
                        <td
                          key={col.key}
                          className={`py-3 px-3.5 ${
                            col.key === "fileNo" || col.key === "invoiceNo" || col.key === "refNo" || col.key === "creditCardNo"
                              ? "font-mono text-[11px] text-slate-800"
                              : col.key === "customerName"
                              ? "font-semibold text-slate-900"
                              : "text-slate-700"
                          }`}
                          title={String(val)}
                        >
                          {val}
                        </td>
                      );
                    })}

                    {/* Sticky Action Column */}
                    <td className="py-3 px-4 text-center sticky right-0 bg-white/95 backdrop-blur-xs border-l border-slate-200 shadow-[-6px_0_12px_rgba(0,0,0,0.06)] z-10">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleEdit(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg cursor-pointer transition-colors"
                          title="Edit record data"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleView(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors"
                          title="View all record details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => downloadSingleReportCsv(r, level)}
                          className="p-1.5 text-slate-400 hover:text-emerald-700 hover:bg-slate-100 rounded-lg cursor-pointer transition-colors"
                          title="Download record CSV"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(recNo)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* Full Details & Edit Modal */}
      <ReportDetailsModal
        isOpen={!!selectedRecord}
        report={selectedRecord ? { ...selectedRecord, level: selectedRecord.level || level } : null}
        defaultLevel={level}
        startInEditMode={startInEditMode}
        onClose={() => {
          setSelectedRecord(null);
          setStartInEditMode(false);
        }}
        onDelete={(recNo) => {
          if (onDeleteRecord) onDeleteRecord(recNo);
          setSelectedRecord(null);
        }}
        onUpdate={(updated) => {
          if (onUpdateRecord) onUpdateRecord(updated);
          setSelectedRecord(updated);
        }}
      />
    </div>
  );
}
