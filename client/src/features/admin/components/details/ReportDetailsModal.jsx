import React, { useState } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Maximize2,
  Minimize2,
  Stethoscope,
  Radio,
  User,
  Calendar,
  CreditCard,
  FileText,
  DollarSign,
  Package,
  Building,
  Phone,
  MapPin,
  Clock,
  ShieldCheck,
  Check,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Hash,
  Download,
} from "lucide-react";
import { downloadSingleReportCsv } from "./reportExportUtils";

export default function ReportDetailsModal({
  isOpen,
  report,
  operator,
  onClose,
  onDelete,
  defaultLevel = "medical",
}) {
  const [showFullCard, setShowFullCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  if (!isOpen || !report) return null;

  const rawLevel = (report.level || defaultLevel || "").toLowerCase();
  const isTelecom = rawLevel === "telecom" || Boolean(report.deviceName || report.phoneCost || report.pricePlans);
  const isMedical = !isTelecom;

  const handleCopyJson = () => {
    try {
      navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn("Failed to copy:", err);
    }
  };

  const maskCard = (num) => {
    if (!num) return "—";
    const s = String(num).replace(/\s+/g, "");
    if (s.length <= 4) return s;
    return "•••• •••• •••• " + s.slice(-4);
  };

  // Known fields handled in sections to prevent duplicate rendering in extra fields
  const standardKeys = new Set([
    "id",
    "_id",
    "userId",
    "level",
    "domain",
    "data",
    "createdAt",
    "updatedAt",
    "fileNo",
    "File No",
    "recordNo",
    "Record No",
    "refNo",
    "Ref No",
    "entryDate",
    "Entry Date",
    "Entry Dates",
    "invoiceNo",
    "Invoice No",
    "accountNo",
    "Account No",
    "customerName",
    "custName",
    "agentName",
    "dispatchNo",
    "dispatchDate",
    "dispatchBy",
    "salesDate",
    "salesTime",
    "emailAddress",
    "email",
    "address",
    "custAddress",
    "pin",
    "zip",
    "status",
    "expirationRemark",
    "creditCardType",
    "creditCardNo",
    "cardExpiryDate",
    "creditRate",
    "productName",
    "quantity",
    "unitPrice",
    "totalPrice",
    "salesTax",
    "shippingCharge",
    "grandTotal",
    "subTotal",
    "tax",
    "discount",
    "netAmount",
    "total",
    "amountInWords",
    "remark",
    "operatorRemark",
    "phoneNo",
    "pricePlans",
    "deviceName",
    "phoneCost",
    "monthlyCost",
    "mms",
    "texts",
    "extraValueIncluded",
    "customerType",
    "initials",
    "companyName",
    "city",
    "state",
    "residenceType",
    "agentNo",
    "agencyCode",
    "agencyName",
    "deposit",
    "balance",
  ]);

  const extraEntries = Object.entries(report).filter(
    ([k, v]) => !standardKeys.has(k) && typeof v !== "object" && v !== undefined && v !== null && v !== ""
  );

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${
        isFullScreen ? "p-0" : "p-2 sm:p-4 lg:p-6"
      } bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200`}
    >
      <div
        className={`bg-white shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all ${
          isFullScreen
            ? "w-screen h-screen rounded-none border-0"
            : "w-full max-w-6xl h-[94vh] sm:h-[96vh] rounded-2xl sm:rounded-3xl"
        }`}
      >

        {/* 1. Modal Top Bar */}
        <div className="bg-[#0f172a] text-white px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              {isMedical ? <Stethoscope className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-100 tracking-tight">
                  Full Entry Details Inspector
                </h3>
                <span className="font-mono text-xs  px-2.5 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {report.recordNo || report["Record No"] || `#${report.id}`}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${isMedical
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                    : "bg-blue-950/80 text-blue-300 border-blue-800"
                    }`}
                >
                  {report.level || (isTelecom ? "Telecom" : "Medical")}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {report.status || "Digitized"}
                </span>
              </div>
              <p className="text-xs  text-slate-400 mt-0.5">
                Complete database record attributes transcribed by the operator.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => downloadSingleReportCsv(report, operator?.username || "operator")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs  font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-2xs"
              title="Download this entry as CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs  font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
              title="Copy entire entry as JSON payload"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied!" : "Copy JSON"}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title={isFullScreen ? "Exit Fullscreen (Restore)" : "Maximize Fullscreen"}
            >
              {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2. Operator & Audit Metadata Strip */}
        <div className="bg-[#f8fafc] border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-3 shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <span>Operator:</span>
              <strong className="text-slate-800 font-semibold">{operator?.username || report.agentName || "abdesh"}</strong>
              {operator?.email && <span className="text-slate-400 text-[11px]">({operator.email})</span>}
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Transcribed on:</span>
              <strong className="text-slate-800 font-semibold">{report.entryDate || report.createdAt || "2026-11-04"}</strong>
            </div>

            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Ref No:</span>
              <span className="font-mono text-slate-700 text-[11px] truncate max-w-[200px]" title={report.refNo}>
                {report.refNo || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              DB Record ID: #{report.id || report._id || "1"}
            </span>
          </div>
        </div>

        {/* 3. Modal Body: Categorized Breakdown */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1 custom-scrollbar">

          {/* ===================== MEDICAL DOMAIN VIEW ===================== */}
          {isMedical && (
            <>
              {/* Category 1: Sales Automation Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Tab 1: Sales Automation Details
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">File No</span>
                    <span className="font-bold font-mono text-slate-900 text-xs  break-all">{report.fileNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Record No</span>
                    <span className="font-bold font-mono text-emerald-800 text-xs ">{report.recordNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Invoice No</span>
                    <span className="font-bold font-mono text-slate-800 text-xs ">{report.invoiceNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Account No</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.accountNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Entry Date</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.entryDate || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Dispatch No</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.dispatchNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Dispatch Date</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.dispatchDate || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Dispatch By</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.dispatchBy || "Harold Jones"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sales Date</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.salesDate || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sales Time</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.salesTime || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Agent Name</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.agentName || "Michael Saliba"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Status</span>
                    <span className="font-bold text-emerald-700 text-xs ">{report.status || "Digitized"}</span>
                  </div>
                </div>
              </div>

              {/* Category 2: Customer & Delivery Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <User className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Customer & Address Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Customer Name</span>
                    <span className="font-bold text-slate-900 text-xs m">{report.customerName || "GWENDOLYN THOMAS"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Email Address</span>
                    <span className="font-medium text-slate-800 text-xs ">{report.emailAddress || "heathercooper@cox.net"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">PIN & ZIP</span>
                    <span className="font-semibold font-mono text-slate-800 text-xs ">
                      PIN: {report.pin || "94112"} | ZIP: {report.zip || "94112"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-3">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Full Physical Address</span>
                    <div className="flex items-center gap-2 text-slate-800 font-medium text-xs ">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{report.address || "132 FENIMORE DR BARNEGAT CA"}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category 3: Payment & Credit Card Verification */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <CreditCard className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Payment & Card Information
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Credit Card Type</span>
                    <span className="font-bold text-slate-800 text-xs ">{report.creditCardType || "MasterCard - Platinum Plus"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Credit Card No</span>
                      <button
                        type="button"
                        onClick={() => setShowFullCard((prev) => !prev)}
                        className="text-[10px] font-semibold text-[#0e6b38] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showFullCard ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showFullCard ? "Mask" : "Reveal"}</span>
                      </button>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs ">
                      {showFullCard ? report.creditCardNo || "4054837481178579" : maskCard(report.creditCardNo || "4054837481178579")}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Expiration Remark</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.expirationRemark || "19-6 18-2"}</span>
                  </div>
                </div>
              </div>

              {/* Category 4: Financial Summary & Verification (Tab 3) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <DollarSign className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Tab 3: Financial Totals & Verification
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sub Total</span>
                    <span className="font-bold font-mono text-slate-900 text-base">
                      ${report.subTotal || report.total || "1450.00"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Tax</span>
                    <span className="font-bold font-mono text-slate-700 text-base">
                      ${report.tax || "0.00"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Discount</span>
                    <span className="font-bold font-mono text-amber-700 text-base">
                      -${report.discount || "50.00"}
                    </span>
                  </div>

                  <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-0.5">Net Total Amount</span>
                    <span className="font-bold font-mono text-[#0e6b38] text-base">
                      ${report.netAmount || report.total || "1400.00"}
                    </span>
                  </div>
                </div>

                {/* Amount in words banner */}
                <div className="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                      Amount in Words
                    </span>
                    <span className="font-bold text-[#14532d] text-xs  sm:text-xs m">
                      {report.amountInWords || "One Thousand Four Hundred Only"}
                    </span>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                </div>

                {/* Operator Remark */}
                {report.remark && (
                  <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                    <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Operator Digitization Remark
                    </span>
                    <p className="text-amber-950 font-medium text-xs  leading-relaxed">{report.remark}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* ===================== TELECOM DOMAIN VIEW ===================== */}
          {isTelecom && (
            <>
              {/* Category 1: Device & Telecom Plan Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <Radio className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Device, Subscriber & Plan Details
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Phone Number</span>
                    <span className="font-bold font-mono text-slate-900 text-xs ">{report.phoneNo || "—"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Device Name</span>
                    <span className="font-bold text-slate-900 text-xs ">{report.deviceName || "iPhone 15 Pro Max 256GB"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Price Plan</span>
                    <span className="font-bold text-slate-800 text-xs ">{report.pricePlans || "Unlimited 5G Plus"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Phone Cost</span>
                    <span className="font-bold font-mono text-slate-900 text-xs ">${report.phoneCost || "1199.00"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Monthly Cost</span>
                    <span className="font-bold font-mono text-blue-700 text-xs ">${report.monthlyCost || "75.00"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">MMS Allowance</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.mms || "Unlimited"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Text Allowance</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.texts || "Unlimited"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Extra Value Included</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.extraValueIncluded || "International Roaming"}</span>
                  </div>
                </div>
              </div>

              {/* Category 2: Customer & Agency Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <Building className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Customer Profile & Agency Attribution
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Customer Name</span>
                    <span className="font-bold text-slate-900 text-xs ">{report.custName || report.customerName || "Alex Rodriguez"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Customer Type & Initials</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.customerType || "Personal"} ({report.initials || "A.R."})</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Company Name</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.companyName || "Rodriguez Media"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Email</span>
                    <span className="font-medium text-slate-800 text-xs ">{report.email || "alex.rodriguez@example.com"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 sm:col-span-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Physical Address</span>
                    <span className="font-medium text-slate-800 text-xs ">
                      {report.custAddress || report.address || "742 Evergreen Terrace"}, {report.city || "Springfield"}, {report.state || "OR"} {report.zip || "97477"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Agent Details</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.agentName || "Robert Walker"} ({report.agentNo || "AGT-4091"})</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Agency Details</span>
                    <span className="font-semibold text-slate-800 text-xs ">{report.agencyName || "Premier Telecom"} ({report.agencyCode || "AGC-77"})</span>
                  </div>
                </div>
              </div>

              {/* Category 3: Financial & Payment */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <h4 className="font-bold text-slate-900 text-xs  sm:text-xs m uppercase tracking-wider">
                    Balance & Payment Processing
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Deposit</span>
                    <span className="font-bold font-mono text-slate-800 text-xs ">${report.deposit || "0.00"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Outstanding Balance</span>
                    <span className="font-bold font-mono text-slate-800 text-xs ">${report.balance || "1199.00"}</span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Credit Rate</span>
                    <span className="font-bold text-blue-700 text-xs ">{report.creditRate || "Grade A"}</span>
                  </div>

                  <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200">
                    <span className="text-[10px] text-blue-700 font-bold uppercase block mb-0.5">Total Invoiced</span>
                    <span className="font-bold font-mono text-blue-900 text-base">${report.total || "1199.00"}</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===================== CATCH-ALL EXTRA ATTRIBUTES ===================== */}
          {extraEntries.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <Hash className="w-4 h-4 text-slate-500" />
                <h4 className="font-bold text-slate-800 text-xs  uppercase tracking-wider">
                  Additional Transcribed Attributes ({extraEntries.length})
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {extraEntries.map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 capitalize block mb-0.5 truncate" title={key}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-semibold text-slate-800 text-xs  truncate block" title={String(val)}>
                      {String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* 4. Modal Footer Actions */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div>
            {onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete entry ${report.recordNo || `#${report.id}`} from database?`)) {
                    onDelete(report.id || report._id);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl text-xs  font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Record</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => downloadSingleReportCsv(report, operator?.username || "operator")}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0e6b38] border border-emerald-200 rounded-xl text-xs  font-semibold cursor-pointer shadow-2xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </button>

            <button
              type="button"
              onClick={handleCopyJson}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs  font-semibold text-slate-700 cursor-pointer shadow-2xs transition-colors"
            >
              {copied ? "Copied to Clipboard" : "Export Record JSON"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 bg-[#0e6b38] hover:bg-[#0b542c] rounded-xl text-xs  font-semibold text-white cursor-pointer shadow-xs transition-colors"
            >
              Close Details
            </button>
          </div>
        </div>

      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}