import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  Maximize2,
  Minimize2,
  Stethoscope,
  Radio,
  User,
  Calendar,
  FileText,
  Package,
  MapPin,
  ShieldCheck,
  Check,
  Copy,
  Trash2,
  Eye,
  EyeOff,
  Hash,
  Download,
  Pencil,
  Save,
  RotateCcw,
  Plus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { downloadSingleReportCsv } from "./reportExportUtils";

export default function ReportDetailsModal({
  isOpen,
  report,
  operator,
  onClose,
  onDelete,
  onUpdate,
  defaultLevel = "medical",
  startInEditMode = false,
}) {
  const [showFullCard, setShowFullCard] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(Boolean(startInEditMode));
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (report) {
      setFormData({
        ...report,
        fileNo: report.fileNo || "1",
        recordNo: report.recordNo || report["Record No"] || "",
        entryDate: report.entryDate || report["Entry Date"] || "",
        refNo: report.refNo || report["Ref No"] || "",
        invoiceNo: report.invoiceNo || report["Invoice No"] || "",
        courierName: report.courierName || report.accountNo || "",
        chqNo: report.chqNo || "",
        dispatchNo: report.dispatchNo || "",
        dispatchBy: report.dispatchBy || "",
        salesDate: report.salesDate || "",
        salesTime: report.salesTime || "",
        customerName: report.customerName || report.custName || "",
        emailAddress: report.emailAddress || report.email || "",
        agentName: report.agentName || "",
        address: report.address || report.custAddress || report.customerAddress || "",
        city: report.city || "",
        state: report.state || "",
        zip: report.zip || report.pin || "",
        customerPhone: report.customerPhone || report.phoneNo || "",
        creditCardType: report.creditCardType || "",
        creditCardNo: report.creditCardNo || "",
        // Telecom specific fields
        invoiceDate: report.invoiceDate || report.entryDate || "",
        phoneNo: report.phoneNo || report.customerPhone || "",
        pricePlans: report.pricePlans || "",
        deviceName: report.deviceName || "",
        phoneCost: report.phoneCost || "",
        monthlyCost: report.monthlyCost || "",
        mms: report.mms || "",
        texts: report.texts || "",
        extraValueIncluded: report.extraValueIncluded || report.extraValue || "",
        customerType: report.customerType || "",
        initials: report.initials || "",
        companyName: report.companyName || "",
        residenceType: report.residenceType || "",
        agentNo: report.agentNo || "",
        agencyCode: report.agencyCode || "",
        agencyName: report.agencyName || "",
        deposit: report.deposit || "",
        balance: report.balance || "",
        cardExpiryDate: report.cardExpiryDate || "",
        creditRate: report.creditRate || "",
        remark: report.remark || "",
        // Financials & Products
        subTotal: report.subTotal || report.total || "",
        tax: report.tax || "0.00",
        discount: report.discount || "0.00",
        netAmount: report.netAmount || report.total || "",
        amountInWords: report.amountInWords || "",
        products: Array.isArray(report.products) ? JSON.parse(JSON.stringify(report.products)) : [],
      });
      setIsEditing(Boolean(startInEditMode));
      setSaveSuccess(false);
      setSaveError("");
    }
  }, [report, startInEditMode]);

  if (!isOpen || !report) return null;

  const rawLevel = (formData.level || report.level || defaultLevel || "").toLowerCase();
  const isTelecom = rawLevel === "telecom" || Boolean(report.deviceName || report.phoneCost || report.pricePlans);
  const isMedical = !isTelecom;

  const handleCopyJson = () => {
    try {
      const dataToCopy = isEditing ? formData : report;
      navigator.clipboard.writeText(JSON.stringify(dataToCopy, null, 2));
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

  const handleFieldChange = (key, val) => {
    setFormData((prev) => ({ ...prev, [key]: val }));
  };

  // Product item handlers (Medical Tab 2)
  const handleProductChange = (index, field, val) => {
    setFormData((prev) => {
      const updatedProducts = [...(prev.products || [])];
      const item = { ...updatedProducts[index], [field]: val };
      if (field === "qty" || field === "price" || field === "rate") {
        const qty = parseFloat(field === "qty" ? val : item.qty) || 0;
        const price = parseFloat(field === "price" || field === "rate" ? val : (item.price || item.rate)) || 0;
        item.total = (qty * price).toFixed(2);
      }
      updatedProducts[index] = item;

      // Auto-recalculate financial totals
      const subTotal = updatedProducts.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
      const discount = parseFloat(prev.discount) || 0;
      const tax = parseFloat(prev.tax) || 0;
      const netAmount = Math.max(0, subTotal + tax - discount).toFixed(2);

      return {
        ...prev,
        products: updatedProducts,
        subTotal: subTotal.toFixed(2),
        total: subTotal.toFixed(2),
        netAmount,
      };
    });
  };

  const handleAddProduct = () => {
    setFormData((prev) => {
      const newProduct = {
        id: Date.now(),
        productNo: `${(prev.products?.length || 0) + 1}-1`,
        qty: 1,
        name: "New Medication",
        price: "0.00",
        total: "0.00",
      };
      const updatedProducts = [...(prev.products || []), newProduct];
      return { ...prev, products: updatedProducts };
    });
  };

  const handleRemoveProduct = (index) => {
    setFormData((prev) => {
      const updatedProducts = (prev.products || []).filter((_, i) => i !== index);
      const subTotal = updatedProducts.reduce((sum, p) => sum + (parseFloat(p.total) || 0), 0);
      const discount = parseFloat(prev.discount) || 0;
      const tax = parseFloat(prev.tax) || 0;
      const netAmount = Math.max(0, subTotal + tax - discount).toFixed(2);

      return {
        ...prev,
        products: updatedProducts,
        subTotal: subTotal.toFixed(2),
        total: subTotal.toFixed(2),
        netAmount,
      };
    });
  };

  // Save edits to MySQL Database & Broadcast
  const handleSave = async () => {
    setIsSaving(true);
    setSaveError("");
    const reportId = report.id || report._id;

    try {
      let savedData = { ...formData };
      if (reportId) {
        const res = await fetch(`https://api.abdivya.com/api/v1/user/reports/${reportId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const json = await res.json();
        if (!json.success) {
          throw new Error(json.message || "Failed to update record on database.");
        }
        if (json.data) {
          savedData = { ...formData, ...json.data };
        }
      }

      setFormData(savedData);
      if (onUpdate) {
        onUpdate(savedData);
      }

      setSaveSuccess(true);
      setTimeout(() => {
        setIsEditing(false);
        setSaveSuccess(false);
      }, 700);
    } catch (err) {
      console.error("Save error:", err);
      setSaveError(err.message || "Failed to save record changes.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setFormData({ ...report });
    setIsEditing(false);
    setSaveError("");
  };

  const MEDICAL_REF_PREFIX = "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- ";
  const extractRefSuffix = (refNo) => {
    if (refNo === null || refNo === undefined) return "";
    const str = String(refNo);
    const prefixRegex = /^Mb_sales-med-np#-[li1]44604#[li1]i?\s*@as-puc[li1]a#-\s*/i;
    const match = str.match(prefixRegex);
    if (match) return str.slice(match[0].length);
    if (str.startsWith(MEDICAL_REF_PREFIX)) return str.slice(MEDICAL_REF_PREFIX.length);
    return str;
  };

  // Reusable Field Card Renderer (Seamless switch between view & edit modes)
  const renderField = ({
    number,
    label,
    fieldKey,
    fallback = "—",
    highlight = false,
    type = "text",
    isMono = false,
  }) => {
    const rawVal = formData[fieldKey] !== undefined ? formData[fieldKey] : (report[fieldKey] ?? fallback);
    const displayVal = rawVal !== undefined && rawVal !== null && rawVal !== "" ? rawVal : fallback;

    if (isEditing) {
      if (fieldKey === "refNo" && isMedical) {
        return (
          <div className="p-2.5 rounded-2xl border border-slate-300 shadow-2xs bg-white">
            <label className="text-[10px] font-bold uppercase block mb-1 text-slate-600">
              {number ? `${number}. ` : ""}{label}
            </label>
            <div className="flex items-center rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:border-[#0e6b38] focus-within:ring-2 focus-within:ring-[#0e6b38]/20">
              <span
                className="bg-slate-100 text-slate-500 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-1.5 border-r border-slate-200 select-none shrink-0 cursor-not-allowed"
                title="Safe & Disabled Reference Prefix (Non-editable)"
              >
                Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#-
              </span>
              <input
                type="text"
                value={extractRefSuffix(rawVal)}
                onChange={(e) => {
                  const cleanSuffix = extractRefSuffix(e.target.value);
                  handleFieldChange("refNo", `${MEDICAL_REF_PREFIX}${cleanSuffix}`);
                }}
                className="w-full bg-slate-50 hover:bg-white focus:bg-white px-2 py-1.5 text-xs text-slate-800 font-mono font-medium outline-none"
                placeholder="00000"
              />
            </div>
          </div>
        );
      }

      return (
        <div
          className={`p-2.5 rounded-2xl border transition-all ${highlight
              ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-500/10"
              : "bg-white border-slate-300 shadow-2xs hover:border-slate-400"
            }`}
        >
          <label className={`text-[10px] font-bold uppercase block mb-1 ${highlight ? "text-emerald-800" : "text-slate-600"}`}>
            {number ? `${number}. ` : ""}{label}
          </label>
          <input
            type={type}
            value={rawVal ?? ""}
            onChange={(e) => handleFieldChange(fieldKey, e.target.value)}
            className={`w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0e6b38] focus:ring-2 focus:ring-[#0e6b38]/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-medium outline-none transition-all ${isMono ? "font-mono" : ""
              }`}
            placeholder={`Enter ${label}...`}
          />
        </div>
      );
    }

    return (
      <div
        className={`p-3 rounded-2xl border ${highlight ? "bg-emerald-50/60 border-emerald-200/80" : "bg-slate-50 border-slate-200/80"
          }`}
      >
        <span className={`text-[10px] font-bold uppercase block mb-0.5 ${highlight ? "text-emerald-800" : "text-slate-500"}`}>
          {number ? `${number}. ` : ""}{label}
        </span>
        <span
          className={`text-xs break-all ${highlight
              ? "font-bold font-mono text-[#0e6b38]"
              : isMono
                ? "font-mono font-semibold text-slate-800"
                : "font-semibold text-slate-800"
            }`}
        >
          {String(displayVal)}
        </span>
      </div>
    );
  };

  // Known standard keys
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
    "courierName",
    "Courier Name",
    "chqNo",
    "dispatchNo",
    "dispatchDate",
    "dispatchBy",
    "salesDate",
    "salesTime",
    "customerName",
    "custName",
    "emailAddress",
    "email",
    "agentName",
    "address",
    "custAddress",
    "customerAddress",
    "city",
    "state",
    "pin",
    "zip",
    "customerPhone",
    "creditCardType",
    "creditCardNo",
    "cardExpiryDate",
    "creditRate",
    "status",
    "expirationRemark",
    "products",
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
    "invoiceDate",
    "phoneNo",
    "pricePlans",
    "deviceName",
    "phoneCost",
    "monthlyCost",
    "mms",
    "texts",
    "extraValueIncluded",
    "extraValue",
    "customerType",
    "initials",
    "companyName",
    "residenceType",
    "agentNo",
    "agencyCode",
    "agencyName",
    "deposit",
    "balance",
  ]);

  const extraEntries = Object.entries(isEditing ? formData : report).filter(
    ([k, v]) => !standardKeys.has(k) && typeof v !== "object" && v !== undefined && v !== null && v !== ""
  );

  const activeRecord = isEditing ? formData : report;

  const modalContent = (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center ${isFullScreen ? "p-0" : "p-2 sm:p-4 lg:p-6"
        } bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200`}
    >
      <div
        className={`bg-white shadow-2xl flex flex-col border border-slate-200 overflow-hidden transition-all ${isFullScreen
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
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-base sm:text-lg text-slate-100 tracking-tight">
                  Full Entry Details Inspector
                </h3>
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-md font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {activeRecord.recordNo || `#${activeRecord.id || report.id}`}
                </span>
                <span
                  className={`text-[11px] font-bold uppercase px-2 py-0.5 rounded-md border ${isMedical
                      ? "bg-emerald-950/80 text-emerald-300 border-emerald-800"
                      : "bg-blue-950/80 text-blue-300 border-blue-800"
                    }`}
                >
                  {activeRecord.level || (isTelecom ? "Telecom" : "Medical")}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                  {activeRecord.status || "Digitized"}
                </span>

                {isEditing && (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 animate-pulse">
                    <Pencil className="w-3 h-3" />
                    <span>Editing Mode</span>
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isEditing
                  ? "Modify transcribed fields below and click Save Changes to persist to database."
                  : "Complete database record attributes transcribed by the operator."}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-2xs"
                  title="Edit data for this record"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadSingleReportCsv(report, operator?.username || "operator")}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white transition-colors cursor-pointer shadow-2xs"
                  title="Download this entry as CSV"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
                  title="Copy entire entry as JSON payload"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy JSON"}</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#0e6b38] hover:bg-[#0b542c] text-white transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saveSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
                </button>
              </div>
            )}

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
              <strong className="text-slate-800 font-semibold">
                {operator?.username || activeRecord.agentName || "abdesh"}
              </strong>
              {operator?.email && <span className="text-slate-400 text-[11px]">({operator.email})</span>}
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Transcribed on:</span>
              <strong className="text-slate-800 font-semibold">
                {activeRecord.entryDate || activeRecord.createdAt || "2026-11-06"}
              </strong>
            </div>

            <div className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Ref No:</span>
              <span className="font-mono text-slate-700 text-[11px] truncate max-w-[200px]" title={activeRecord.refNo}>
                {activeRecord.refNo || "—"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded font-mono font-medium">
              DB Record ID: #{report.id || report._id || "1"}
            </span>
          </div>
        </div>

        {/* Status Alerts if any */}
        {saveError && (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2.5 flex items-center gap-2 text-xs text-red-700 shrink-0">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{saveError}</span>
          </div>
        )}
        {saveSuccess && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs text-emerald-800 shrink-0">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>Record updated and synced successfully to database!</span>
          </div>
        )}

        {/* 3. Modal Body: Categorized Breakdown */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-xs text-slate-700 flex-1 custom-scrollbar">
          {/* ===================== MEDICAL DOMAIN VIEW ===================== */}
          {isMedical && (
            <>
              {/* Category 1: Sales Automation Information - Exact Sequence Matching Notebook 1 (1 to 21) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0e6b38]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      WorkTab Entry Fields (Exact Input Sequence 1 to 21)
                    </h4>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                        <Pencil className="w-3 h-3" />
                        Editable Inputs
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        Standard WorkTab Sequence
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {/* Row 1: File no | Record no | Entry date */}
                  {renderField({ number: 1, label: "File No", fieldKey: "fileNo", fallback: "1", isMono: true })}
                  {renderField({ number: 2, label: "Record No", fieldKey: "recordNo", fallback: "00000843843", highlight: true, isMono: true })}
                  {renderField({ number: 3, label: "Entry Date", fieldKey: "entryDate", fallback: "2026-11-06", type: "date" })}

                  {/* Row 2: Ref no | Invoice no | Courier name */}
                  {renderField({ number: 4, label: "Ref No", fieldKey: "refNo", fallback: `${formData.fileNo || "1"} @as-PUC1a#- 00000`, isMono: true })}
                  {renderField({ number: 5, label: "Invoice No", fieldKey: "invoiceNo", fallback: "SP-l7700IOOI", isMono: true })}
                  {renderField({ number: 6, label: "Courier Name", fieldKey: "courierName", fallback: "TELCORDIA" })}

                  {/* Row 3: Chq no | Dispatch no | Dispatch by */}
                  {renderField({ number: 7, label: "Chq No", fieldKey: "chqNo", fallback: "CHQ-4556327", isMono: true })}
                  {renderField({ number: 8, label: "Dispatch No", fieldKey: "dispatchNo", fallback: "T-4556327260", isMono: true })}
                  {renderField({ number: 9, label: "Dispatch By", fieldKey: "dispatchBy", fallback: "Harold Jones" })}

                  {/* Row 4: Sales date | Sales time | Customer name */}
                  {renderField({ number: 10, label: "Sales Date", fieldKey: "salesDate", fallback: "1999-10-03", type: "date" })}
                  {renderField({ number: 11, label: "Sales Time", fieldKey: "salesTime", fallback: "12:11 PM" })}
                  {renderField({ number: 12, label: "Customer Name", fieldKey: "customerName", fallback: "GWENDOLYN THOMAS" })}

                  {/* Row 5: EMAIL ADDRESS | Agent Name | Address */}
                  {renderField({ number: 13, label: "Email Address", fieldKey: "emailAddress", fallback: "heathercooper@cox.net", type: "email" })}
                  {renderField({ number: 14, label: "Agent Name", fieldKey: "agentName", fallback: "Michael Saliba" })}
                  {renderField({ number: 15, label: "Address", fieldKey: "address", fallback: "132 FENIMORE DR" })}

                  {/* Row 6: CITY | STATE | ZIP */}
                  {renderField({ number: 16, label: "City", fieldKey: "city", fallback: "BARNEGAT" })}
                  {renderField({ number: 17, label: "State", fieldKey: "state", fallback: "CA" })}
                  {renderField({ number: 18, label: "Zip", fieldKey: "zip", fallback: "94112", isMono: true })}

                  {/* Row 7: CUSTOMER PHONE | Credit card Type | Credit card number */}
                  {renderField({ number: 19, label: "Customer Phone", fieldKey: "customerPhone", fallback: "(505) 285-5806", type: "tel" })}
                  {renderField({ number: 20, label: "Credit Card Type", fieldKey: "creditCardType", fallback: "MasterCard - Platinum Plus" })}

                  {/* Field 21: Credit Card Number */}
                  {isEditing ? (
                    <div className="p-2.5 bg-white rounded-2xl border border-slate-300 shadow-2xs">
                      <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">
                        21. Credit Card Number
                      </label>
                      <input
                        type="text"
                        value={formData.creditCardNo ?? ""}
                        onChange={(e) => handleFieldChange("creditCardNo", e.target.value)}
                        className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0e6b38] focus:ring-2 focus:ring-[#0e6b38]/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono font-medium outline-none transition-all"
                        placeholder="Enter credit card number..."
                      />
                    </div>
                  ) : (
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] text-slate-500 font-bold uppercase">
                          21. Credit Card Number
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowFullCard((prev) => !prev)}
                          className="text-[10px] font-semibold text-[#0e6b38] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          {showFullCard ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showFullCard ? "Mask" : "Reveal"}</span>
                        </button>
                      </div>
                      <span className="font-mono font-bold text-slate-900 text-xs">
                        {showFullCard
                          ? activeRecord.creditCardNo || "4054837481178579"
                          : maskCard(activeRecord.creditCardNo || "4054837481178579")}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Category 2: Product Sale Items (Tab 2) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-[#0e6b38]" />
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Tab 2: Product Sale Items ({formData.products?.length || 0})
                    </h4>
                  </div>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleAddProduct}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-[#0e6b38] border border-emerald-300 rounded-lg cursor-pointer transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Item</span>
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold text-[11px] uppercase tracking-wider">
                        <th className="py-2.5 px-3 text-center w-12">NO</th>
                        <th className="py-2.5 px-3 text-left w-32">PRODUCT NO</th>
                        <th className="py-2.5 px-3 text-center w-20">QTY</th>
                        <th className="py-2.5 px-3 text-left">PRODUCT NAME</th>
                        <th className="py-2.5 px-3 text-right w-28">RATE</th>
                        <th className="py-2.5 px-3 text-right w-28">TOTAL</th>
                        {isEditing && <th className="py-2.5 px-3 text-center w-14">ACTION</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {(formData.products || []).length === 0 ? (
                        <tr>
                          <td colSpan={isEditing ? 7 : 6} className="py-6 text-center text-slate-400 italic">
                            No product sale items recorded for this prescription entry.
                          </td>
                        </tr>
                      ) : (
                        (formData.products || []).map((item, idx) => (
                          <tr key={item.id || idx} className="hover:bg-slate-50/60">
                            <td className="py-2.5 px-3 text-center font-bold text-slate-500">{idx + 1}</td>

                            {isEditing ? (
                              <>
                                <td className="py-1.5 px-3">
                                  <input
                                    type="text"
                                    value={item.productNo || ""}
                                    onChange={(e) => handleProductChange(idx, "productNo", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-mono"
                                  />
                                </td>
                                <td className="py-1.5 px-3 text-center">
                                  <input
                                    type="number"
                                    min="1"
                                    value={item.qty || 1}
                                    onChange={(e) => handleProductChange(idx, "qty", e.target.value)}
                                    className="w-16 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-center font-bold"
                                  />
                                </td>
                                <td className="py-1.5 px-3">
                                  <input
                                    type="text"
                                    value={item.name || item.productName || ""}
                                    onChange={(e) => handleProductChange(idx, "name", e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs font-medium"
                                  />
                                </td>
                                <td className="py-1.5 px-3 text-right">
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={item.price ?? item.rate ?? ""}
                                    onChange={(e) => handleProductChange(idx, "price", e.target.value)}
                                    className="w-24 bg-slate-50 border border-slate-300 rounded px-2 py-1 text-xs text-right font-mono"
                                  />
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                  {parseFloat(item.total || (item.qty * (item.price || item.rate || 0)) || 0).toFixed(2)}
                                </td>
                                <td className="py-1.5 px-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveProduct(idx)}
                                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded cursor-pointer"
                                    title="Delete product item"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </>
                            ) : (
                              <>
                                <td className="py-2.5 px-3 font-mono font-semibold text-slate-800">{item.productNo || "—"}</td>
                                <td className="py-2.5 px-3 text-center font-bold text-slate-800">{item.qty || 1}</td>
                                <td className="py-2.5 px-3 text-slate-800 font-medium">{item.name || item.productName || "—"}</td>
                                <td className="py-2.5 px-3 text-right font-mono text-slate-700">
                                  {parseFloat(item.price || item.rate || 0).toFixed(2)}
                                </td>
                                <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">
                                  {parseFloat(item.total || (item.qty * (item.price || item.rate || 0)) || 0).toFixed(2)}
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Category 3: Financial Summary & Verification (Tab 3) */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                  <FileText className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Tab 3: Financial Totals & Verification
                  </h4>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {isEditing ? (
                    <>
                      <div className="p-3 bg-white rounded-2xl border border-slate-300 shadow-2xs">
                        <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">Sub Total</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.subTotal ?? ""}
                          onChange={(e) => handleFieldChange("subTotal", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-slate-300 shadow-2xs">
                        <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">Tax</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.tax ?? ""}
                          onChange={(e) => handleFieldChange("tax", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold"
                        />
                      </div>

                      <div className="p-3 bg-white rounded-2xl border border-slate-300 shadow-2xs">
                        <label className="text-[10px] text-amber-700 font-bold uppercase block mb-1">Discount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.discount ?? ""}
                          onChange={(e) => handleFieldChange("discount", e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-amber-800"
                        />
                      </div>

                      <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300">
                        <label className="text-[10px] text-[#0e6b38] font-bold uppercase block mb-1">Net Total Amount</label>
                        <input
                          type="number"
                          step="0.01"
                          value={formData.netAmount ?? ""}
                          onChange={(e) => handleFieldChange("netAmount", e.target.value)}
                          className="w-full bg-white border border-emerald-400 rounded px-2.5 py-1.5 text-xs font-mono font-bold text-[#0e6b38]"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Sub Total</span>
                        <span className="font-bold font-mono text-slate-900 text-base">
                          {activeRecord.subTotal || activeRecord.total || "1450.00"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Tax</span>
                        <span className="font-bold font-mono text-slate-700 text-base">
                          {activeRecord.tax || "0.00"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">Discount</span>
                        <span className="font-bold font-mono text-amber-700 text-base">
                          -{activeRecord.discount || "50.00"}
                        </span>
                      </div>

                      <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200">
                        <span className="text-[10px] text-emerald-700 font-bold uppercase block mb-0.5">Net Total Amount</span>
                        <span className="font-bold font-mono text-[#0e6b38] text-base">
                          {activeRecord.netAmount || activeRecord.total || "1400.00"}
                        </span>
                      </div>
                    </>
                  )}
                </div>

                {/* Amount in words */}
                {isEditing ? (
                  <div className="p-3 bg-white border border-slate-300 rounded-2xl">
                    <label className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block mb-1">
                      Amount in Words
                    </label>
                    <input
                      type="text"
                      value={formData.amountInWords ?? ""}
                      onChange={(e) => handleFieldChange("amountInWords", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs font-semibold text-slate-800"
                      placeholder="One Thousand Four Hundred Only..."
                    />
                  </div>
                ) : (
                  <div className="p-3.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-bold text-[#166534] uppercase tracking-wider block">
                        Amount in Words
                      </span>
                      <span className="font-bold text-[#14532d] text-xs">
                        {activeRecord.amountInWords || "One Thousand Four Hundred Only"}
                      </span>
                    </div>
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                  </div>
                )}

                {/* Operator Remark */}
                {isEditing ? (
                  <div className="p-3 bg-white border border-slate-300 rounded-2xl">
                    <label className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                      Operator Digitization Remark
                    </label>
                    <textarea
                      rows={2}
                      value={formData.remark ?? ""}
                      onChange={(e) => handleFieldChange("remark", e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-800"
                      placeholder="Enter verification or digitization remark..."
                    />
                  </div>
                ) : (
                  activeRecord.remark && (
                    <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl">
                      <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                        Operator Digitization Remark
                      </span>
                      <p className="text-amber-950 font-medium text-xs leading-relaxed">{activeRecord.remark}</p>
                    </div>
                  )
                )}
              </div>
            </>
          )}

          {/* ===================== TELECOM DOMAIN VIEW ===================== */}
          {isTelecom && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-[#0e6b38]" />
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                    Telecom Contract Entry Fields (Exact 33 Inputs in Sequence 1 to 33)
                  </h4>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                      <Pencil className="w-3 h-3" />
                      Editable Inputs
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Notebook Telecom Sequence (11 Rows × 3 Cols)
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* Row 1: File no | Record no | Invoice no */}
                {renderField({ number: 1, label: "File No", fieldKey: "fileNo", fallback: "1", isMono: true })}
                {renderField({ number: 2, label: "Record No", fieldKey: "recordNo", fallback: "00000843801", highlight: true, isMono: true })}
                {renderField({ number: 3, label: "Invoice No", fieldKey: "invoiceNo", fallback: "TC-l7700IOOI", isMono: true })}

                {/* Row 2: Invoice date | Phone no | Price Plans */}
                {renderField({ number: 4, label: "Invoice Date", fieldKey: "invoiceDate", fallback: "1999-10-03", type: "date" })}
                {renderField({ number: 5, label: "Phone No", fieldKey: "phoneNo", fallback: "(505) 391-3151", type: "tel" })}
                {renderField({ number: 6, label: "Price Plans", fieldKey: "pricePlans", fallback: "Unlimited 5G Plus Enterprise" })}

                {/* Row 3: Device name | Phone cost | Monthly cost */}
                {renderField({ number: 7, label: "Device Name", fieldKey: "deviceName", fallback: "iPhone 15 Pro Max 256GB - Titanium" })}
                {renderField({ number: 8, label: "Phone Cost", fieldKey: "phoneCost", fallback: "1199.00", isMono: true })}
                {renderField({ number: 9, label: "Monthly Cost", fieldKey: "monthlyCost", fallback: "75.00", isMono: true })}

                {/* Row 4: MMS | Texts | Extra value */}
                {renderField({ number: 10, label: "MMS", fieldKey: "mms", fallback: "Unlimited" })}
                {renderField({ number: 11, label: "Texts", fieldKey: "texts", fallback: "Unlimited" })}
                {renderField({ number: 12, label: "Extra Value", fieldKey: "extraValueIncluded", fallback: "International Roaming Pack" })}

                {/* Row 5: Customer Type | Customer Name | Initials */}
                {renderField({ number: 13, label: "Customer Type", fieldKey: "customerType", fallback: "Corporate" })}
                {renderField({ number: 14, label: "Customer Name", fieldKey: "customerName", fallback: "DARRELL TUCKER" })}
                {renderField({ number: 15, label: "Initials", fieldKey: "initials", fallback: "DT", isMono: true })}

                {/* Row 6: Company name | Customer Address | Email */}
                {renderField({ number: 16, label: "Company Name", fieldKey: "companyName", fallback: "CUSTER INC" })}
                {renderField({ number: 17, label: "Customer Address", fieldKey: "address", fallback: "1309 BRIARWOOD DR" })}
                {renderField({ number: 18, label: "Email", fieldKey: "emailAddress", fallback: "aguilar@camelbak.com", type: "email" })}

                {/* Row 7: City | State | Zip */}
                {renderField({ number: 19, label: "City", fieldKey: "city", fallback: "ATLANTIC CITY" })}
                {renderField({ number: 20, label: "State", fieldKey: "state", fallback: "NJ" })}
                {renderField({ number: 21, label: "Zip", fieldKey: "zip", fallback: "94175", isMono: true })}

                {/* Row 8: Residence type | Agent no | Agent name */}
                {renderField({ number: 22, label: "Residence Type", fieldKey: "residenceType", fallback: "Own" })}
                {renderField({ number: 23, label: "Agent No", fieldKey: "agentNo", fallback: "AG-84867", isMono: true })}
                {renderField({ number: 24, label: "Agent Name", fieldKey: "agentName", fallback: "Jerry Jolly" })}

                {/* Row 9: Agency code | Agency name | Deposit */}
                {renderField({ number: 25, label: "Agency Code", fieldKey: "agencyCode", fallback: "AC-7762", isMono: true })}
                {renderField({ number: 26, label: "Agency Name", fieldKey: "agencyName", fallback: "ALLEN AGENCY" })}
                {renderField({ number: 27, label: "Deposit", fieldKey: "deposit", fallback: "150.00", isMono: true })}

                {/* Row 10: Balance | Credit card type | Card no */}
                {renderField({ number: 28, label: "Balance", fieldKey: "balance", fallback: "1274.00", isMono: true })}
                {renderField({ number: 29, label: "Credit Card Type", fieldKey: "creditCardType", fallback: "MasterCard Gold Card" })}

                {/* Field 30: Card No */}
                {isEditing ? (
                  <div className="p-2.5 bg-white rounded-2xl border border-slate-300 shadow-2xs">
                    <label className="text-[10px] text-slate-600 font-bold uppercase block mb-1">
                      30. Card No
                    </label>
                    <input
                      type="text"
                      value={formData.creditCardNo ?? ""}
                      onChange={(e) => handleFieldChange("creditCardNo", e.target.value)}
                      className="w-full bg-slate-50 hover:bg-white focus:bg-white border border-slate-300 focus:border-[#0e6b38] focus:ring-2 focus:ring-[#0e6b38]/20 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-mono font-medium outline-none transition-all"
                      placeholder="Enter credit card number..."
                    />
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] text-slate-500 font-bold uppercase">30. Card No</span>
                      <button
                        type="button"
                        onClick={() => setShowFullCard((prev) => !prev)}
                        className="text-[10px] font-semibold text-[#0e6b38] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {showFullCard ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        <span>{showFullCard ? "Mask" : "Reveal"}</span>
                      </button>
                    </div>
                    <span className="font-mono font-bold text-slate-900 text-xs">
                      {showFullCard
                        ? activeRecord.creditCardNo || "6982762337151429"
                        : maskCard(activeRecord.creditCardNo || "6982762337151429")}
                    </span>
                  </div>
                )}

                {/* Row 11: Card Expiry date | Credit rate | Remark */}
                {renderField({ number: 31, label: "Card Expiry Date", fieldKey: "cardExpiryDate", fallback: "2028-11-30", type: "date" })}
                {renderField({ number: 32, label: "Credit Rate", fieldKey: "creditRate", fallback: "Grade A (14.5%)" })}
                {renderField({ number: 33, label: "Remark", fieldKey: "remark", fallback: "Telecom CAF verified against customer photo ID and credit score grade." })}
              </div>
            </div>
          )}

          {/* ===================== CATCH-ALL EXTRA ATTRIBUTES ===================== */}
          {extraEntries.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 pb-1.5 border-b border-slate-200">
                <Hash className="w-4 h-4 text-slate-500" />
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                  Additional Transcribed Attributes ({extraEntries.length})
                </h4>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {extraEntries.map(([key, val]) => (
                  <div key={key} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/70">
                    <span className="text-[10px] font-bold text-slate-400 capitalize block mb-0.5 truncate" title={key}>
                      {key.replace(/([A-Z])/g, " $1")}
                    </span>
                    <span className="font-semibold text-slate-800 text-xs truncate block" title={String(val)}>
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
            {!isEditing && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Permanently delete entry ${report.recordNo || `#${report.id}`} from database?`)) {
                    onDelete(report.id || report._id || report.recordNo);
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Record</span>
              </button>
            )}

            {isEditing && (
              <span className="text-[11px] text-amber-800 font-semibold bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Editing Mode: Click Save Changes to update database.</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs cursor-pointer shadow-xs transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Edit Record</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadSingleReportCsv(report, operator?.username || "operator")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-[#0e6b38] border border-emerald-200 rounded-xl text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer shadow-2xs transition-colors"
                >
                  {copied ? "Copied to Clipboard" : "Export Record JSON"}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 bg-[#0e6b38] hover:bg-[#0b542c] rounded-xl text-xs font-semibold text-white cursor-pointer shadow-xs transition-colors"
                >
                  Close Details
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 px-5 py-2 bg-[#0e6b38] hover:bg-[#0b542c] rounded-xl text-xs font-bold text-white cursor-pointer shadow-xs transition-colors disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : saveSuccess ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>{isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Changes"}</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : modalContent;
}
