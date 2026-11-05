import React, { useState, useRef } from "react";
import sampleDocImg from "../../../../assets/sample-scanned-doc.jpg";
import {
  FileText,
  ShoppingCart,
  LayoutGrid,
  RotateCcw,
  BookmarkCheck,
  ArrowRight,
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Clock,
  ChevronDown,
  CheckCircle2,
  Radio,
  Upload,
  Maximize2,
} from "lucide-react";

// Helpers for native date/time pickers
const parseDateToIso = (dateStr) => {
  if (!dateStr) return "";
  const cleaned = String(dateStr).trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) return cleaned;
  const ymdMatch = cleaned.match(/^(\d{4})[\s\/\.](\d{1,2})[\s\/\.](\d{1,2})$/);
  if (ymdMatch) {
    const [, y, m, d] = ymdMatch;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  const dmyMatch = cleaned.match(/^(\d{1,2})[\s\/\-\.](\d{1,2})[\s\/\-\.](\d{4})$/);
  if (dmyMatch) {
    const [, d, m, y] = dmyMatch;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  }
  return "";
};

const formatTimePickerValue = (timeStr) => {
  if (!timeStr) return "";
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  if (isNaN(h)) return timeStr;
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12;
  if (h === 0) h = 12;
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(h)}:${m} ${ampm}`;
};

const parseTimeTo24h = (timeStr) => {
  if (!timeStr) return "";
  const match = String(timeStr).match(/(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?/i);
  if (!match) return "";
  let h = parseInt(match[1], 10);
  const m = match[2];
  const ampm = match[3]?.toUpperCase();
  if (ampm === "PM" && h < 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return `${String(h).padStart(2, "0")}:${m}`;
};

export default function WorkTab({
  domain = "medical",
  onSaveRecord,
  duplicateReportEnabled = false,
  jumbleUpReports = false,
  imageSrc,
  imageName,
  onOpenImageModal,
  onImageSelect,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && onImageSelect) {
      onImageSelect(file);
    }
  };
  const isTelecom = domain === "telecom";
  const todayStr = new Date().toISOString().split("T")[0];
  const currentImage = imageSrc || sampleDocImg;

  const [formData, setFormData] = useState({
    fileNo: isTelecom ? "TC_Sales-Tel-Np#-l44604#1I" : "Mb_Sales-Med-Np#-l44604#1I",
    recordNo: isTelecom ? "00000843801" : "00000843843",
    refNo: isTelecom
      ? "TC_Sales-Tel-Np#-l44604#1I @as-PUC1a#- 00000"
      : "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
    entryDate: todayStr,
    invoiceNo: isTelecom ? "TC-l7700IOOI" : "SP-l7700IOOI",
    accountNo: "TELCORDIA",
    dispatchNo: "T-4556327260",
    dispatchDate: "1999-09-10",
    salesDate: "1999-10-03",
    salesTime: "12:11 PM",
    customerName: isTelecom ? "ALEX RODRIGUEZ" : "GWENDOLYN THOMAS",
    dispatchBy: "Harold Jones",
    agentName: isTelecom ? "Robert Walker" : "Michael Saliba",
    emailAddress: isTelecom ? "alex.rodriguez@example.com" : "heathercooper@cox.net",
    address: isTelecom ? "742 EVERGREEN TERRACE SPRINGFIELD OR" : "132 FENIMORE DR BARNEGAT CA",
    pin: "94112",
    zip: "94112",
    status: "Digitized",
    creditCardType: "MasterCard - Platinum Plus",
    creditCardNo: "4054837481178579",
    expirationRemark: "19-6 18-2",
  });

  const [products, setProducts] = useState(
    isTelecom
      ? [
        { id: 1, name: "iPhone 15 Pro Max 256GB - Titanium", qty: 1, price: 1199.0, total: 1199.0 },
        { id: 2, name: "Unlimited 5G Plus Enterprise SIM Plan", qty: 1, price: 75.0, total: 75.0 },
        { id: 3, name: "International Roaming & Device Protect Pack", qty: 1, price: 126.0, total: 126.0 },
      ]
      : [
        { id: 1, name: "Amoxicillin 500mg Oral Capsule", qty: 2, price: 45.0, total: 90.0 },
        { id: 2, name: "Metformin Hydrochloride 850mg", qty: 1, price: 30.0, total: 30.0 },
        { id: 3, name: "Clinical Physician Consultation", qty: 1, price: 1330.0, total: 1330.0 },
      ]
  );

  const [totalData, setTotalData] = useState({
    total: isTelecom ? "1400.00" : "1450.00",
    discount: isTelecom ? "0.00" : "50.00",
    netAmount: "1400.00",
    amountInWords: "One Thousand Four Hundred Only",
    remark: isTelecom
      ? "Telecom CAF verified against customer photo ID and credit score grade."
      : "Prescription sheet verified against physician registry signature.",
  });

  const [activeSubTab, setActiveSubTab] = useState("sales_automation");

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTotalChange = (e) => {
    const { name, value } = e.target;
    setTotalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "qty" || field === "price") {
            const qty = parseFloat(updated.qty) || 0;
            const price = parseFloat(updated.price) || 0;
            updated.total = (qty * price).toFixed(2);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddProduct = () => {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: isTelecom ? "Telecom Plan / Hardware Device" : "Medical Product / Service",
        qty: 1,
        price: 0.0,
        total: "0.00",
      },
    ]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClear = () => {
    if (confirm(`Clear current ${isTelecom ? "Telecom" : "Medical"} form inputs?`)) {
      setFormData({
        fileNo: "",
        recordNo: "",
        refNo: isTelecom
          ? "TC_Sales-Tel-Np#-l44604#1I @as-PUC1a#- 00000"
          : "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
        entryDate: todayStr,
        invoiceNo: isTelecom ? "TC-l7700IOOI" : "SP-l7700IOOI",
        accountNo: "",
        dispatchNo: "",
        dispatchDate: "",
        salesDate: "",
        salesTime: "",
        customerName: "",
        dispatchBy: "",
        agentName: "",
        emailAddress: "",
        address: "",
        pin: "",
        zip: "",
        status: "Digitized",
        creditCardType: "MasterCard - Platinum Plus",
        creditCardNo: "",
        expirationRemark: "",
      });
    }
  };

  const handleSaveDraft = () => {
    alert(`Draft saved for ${isTelecom ? "Telecom" : "Medical"} Record No: ${formData.recordNo}`);
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();

    if (activeSubTab === "sales_automation") {
      if (!formData.recordNo || !formData.recordNo.trim()) {
        alert("Please enter a Record No before proceeding.");
        return;
      }
      setActiveSubTab("product_sale");
    } else if (activeSubTab === "product_sale") {
      const gross = products.reduce(
        (sum, item) => sum + (parseFloat(item.total) || 0),
        0
      );
      const disc = parseFloat(totalData.discount) || 0;
      const net = Math.max(0, gross - disc);

      setTotalData((prev) => ({
        ...prev,
        total: gross.toFixed(2),
        netAmount: net.toFixed(2),
      }));

      setActiveSubTab("total");
    } else if (activeSubTab === "total") {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    if (!formData.recordNo || !formData.recordNo.trim()) {
      alert("Record No is required to save.");
      setActiveSubTab("sales_automation");
      return;
    }

    const payload = {
      ...formData,
      ...totalData,
      products,
      domain: isTelecom ? "telecom" : "medical",
      level: isTelecom ? "telecom" : "medical",
      timestamp: new Date().toISOString(),
    };

    if (onSaveRecord) {
      onSaveRecord(payload);
      if (duplicateReportEnabled) {
        onSaveRecord({
          ...payload,
          recordNo: payload.recordNo + "_DUP",
        });
      }
    }

    const num = parseInt(formData.recordNo.replace(/\D/g, "") || "843843", 10) + 1;
    const nextRecNo = String(num).padStart(11, "0");

    setFormData((prev) => ({
      ...prev,
      recordNo: nextRecNo,
      customerName: "",
      emailAddress: "",
      address: "",
      creditCardNo: "",
    }));

    setTotalData((prev) => ({
      ...prev,
      discount: "0.00",
      amountInWords: "",
      remark: "",
    }));

    setActiveSubTab("sales_automation");
  };

  const stepProgress =
    activeSubTab === "sales_automation"
      ? "33.3%"
      : activeSubTab === "product_sale"
        ? "66.6%"
        : "100%";

  return (
    <form onSubmit={handleNextStep} className="space-y-0">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">

        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveSubTab("sales_automation")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] font-semibold transition-all duration-200 cursor-pointer rounded-t-lg border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "sales_automation"
              ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
              : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "sales_automation"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-slate-200 text-slate-600"
                }`}
            >
              1
            </span>
            <FileText className={`w-3.5 h-3.5 ${activeSubTab === "sales_automation" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Sales Automation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("product_sale")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] font-semibold transition-all duration-200 cursor-pointer rounded-t-lg border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "product_sale"
              ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
              : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "product_sale"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : activeSubTab === "total"
                  ? "bg-emerald-100 text-[#0e6b38]"
                  : "bg-slate-200 text-slate-600"
                }`}
            >
              2
            </span>
            <ShoppingCart className={`w-3.5 h-3.5 ${activeSubTab === "product_sale" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Product Sale</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("total")}
            className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-[12px] font-semibold transition-all duration-200 cursor-pointer rounded-t-lg border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "total"
              ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
              : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "total"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-slate-200 text-slate-600"
                }`}
            >
              3
            </span>
            <LayoutGrid className={`w-3.5 h-3.5 ${activeSubTab === "total" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Total</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 pb-1">
          {activeSubTab === "sales_automation" ? (
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] cursor-pointer transition-colors shadow-2xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Clear</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (activeSubTab === "product_sale") setActiveSubTab("sales_automation");
                if (activeSubTab === "total") setActiveSubTab("product_sale");
              }}
              className="inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] cursor-pointer transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-lg text-[12px] cursor-pointer transition-colors shadow-2xs"
          >
            <BookmarkCheck className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>

          {activeSubTab !== "total" ? (
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 px-3.5 py-1 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-lg text-[12px] shadow-xs cursor-pointer transition-colors"
            >
              <span>Save & Next</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-1 px-3.5 py-1 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-lg text-[12px] shadow-xs cursor-pointer transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Store Record</span>
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mt-1.5">

        <div className="w-full bg-emerald-50 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-[#0e6b38] h-full transition-all duration-300 ease-out"
            style={{ width: stepProgress }}
          />
        </div>

        <div key={activeSubTab} className="animate-tab-slide">
          {activeSubTab === "sales_automation" && (
            <div className="p-2 sm:p-2.5 bg-slate-50/70 grid grid-cols-1 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-1.5">
              {/* Row 1: File No, Account No, Entry Date */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  File No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="fileNo"
                    value={formData.fileNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Account No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Entry Date:
                </label>
                <div className="relative flex-1 flex items-center group">
                  <input
                    type="text"
                    name="entryDate"
                    value={formData.entryDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                  />
                  <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                    <input
                      type="date"
                      title="Click to select date from calendar"
                      value={parseDateToIso(formData.entryDate)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData((prev) => ({ ...prev, entryDate: e.target.value }));
                        }
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Record No, Invoice No, Customer Name */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-emerald-800 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Record No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="recordNo"
                    required
                    value={formData.recordNo}
                    onChange={handleFieldChange}
                    className="w-full bg-emerald-50/80 border border-emerald-300 rounded-md px-2.5 py-1 text-[12px] font-bold text-[#0e6b38] focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs font-mono transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Invoice No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Customer Name:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Dispatch No, Dispatch Date, Dispatch By */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Dispatch No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="dispatchNo"
                    placeholder="e.g. T-4556327260"
                    value={formData.dispatchNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Dispatch Date:
                </label>
                <div className="relative flex-1 flex items-center group">
                  <input
                    type="text"
                    name="dispatchDate"
                    value={formData.dispatchDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                  />
                  <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                    <input
                      type="date"
                      title="Click to select date from calendar"
                      value={parseDateToIso(formData.dispatchDate)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData((prev) => ({ ...prev, dispatchDate: e.target.value }));
                        }
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Dispatch By:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="dispatchBy"
                    value={formData.dispatchBy}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 4: Sales Date, Sales Time, Ref No */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Sales Date:
                </label>
                <div className="relative flex-1 flex items-center group">
                  <input
                    type="text"
                    name="salesDate"
                    value={formData.salesDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                  />
                  <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                    <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                    <input
                      type="date"
                      title="Click to select date from calendar"
                      value={parseDateToIso(formData.salesDate)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData((prev) => ({ ...prev, salesDate: e.target.value }));
                        }
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Sales Time:
                </label>
                <div className="relative flex-1 flex items-center group">
                  <input
                    type="text"
                    name="salesTime"
                    value={formData.salesTime}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                  />
                  <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                    <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                    <input
                      type="time"
                      title="Click to select time from clock"
                      value={parseTimeTo24h(formData.salesTime)}
                      onChange={(e) => {
                        if (e.target.value) {
                          setFormData((prev) => ({
                            ...prev,
                            salesTime: formatTimePickerValue(e.target.value),
                          }));
                        }
                      }}
                      onClick={(e) => {
                        try {
                          e.currentTarget.showPicker();
                        } catch {}
                      }}
                      className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Ref No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 5: Email Address, Agent Name, Address */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Email Address:
                </label>
                <div className="relative flex-1">
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Agent Name:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Address:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 6: PIN, Zip, Expiration Remark */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  PIN:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Zip:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Expiration Remark:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="expirationRemark"
                    value={formData.expirationRemark}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              {/* Row 7: Status, Credit Card Type, Credit Card No */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Status:
                </label>
                <div className="relative flex-1 flex items-center">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-7 cursor-pointer"
                  >
                    <option value="Digitized">Digitized</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Credit Card Type:
                </label>
                <div className="relative flex-1 flex items-center">
                  <select
                    name="creditCardType"
                    value={formData.creditCardType}
                    onChange={handleFieldChange}
                    className="w-full appearance-none bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-7 cursor-pointer"
                  >
                    <option value="MasterCard - Platinum Plus">MasterCard - Platinum Plus</option>
                    <option value="Visa Gold Credit Card">Visa Gold Credit Card</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Credit Card No:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="creditCardNo"
                    value={formData.creditCardNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "product_sale" && (
            <div className="p-2.5 sm:p-3 space-y-2">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-100">
                <div>
                  <h4 className="text-[12px] font-bold text-slate-800">
                    {isTelecom ? "Telecom Plans & Equipment Items" : "Medical Prescription Products"}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {isTelecom
                      ? "Record itemized devices, data plans, and add-on services."
                      : "Record itemized medications, doses, and clinical billables."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#0e6b38] text-white rounded-lg text-[12px] font-semibold hover:bg-[#0b542c] cursor-pointer shadow-2xs"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-200">
                <table className="w-full text-left text-[12px] border-collapse min-w-[500px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-bold uppercase text-[11px]">
                      <th className="py-1.5 px-3">Item Description</th>
                      <th className="py-1.5 px-3 w-24">Qty</th>
                      <th className="py-1.5 px-3 w-32">Unit Price ($)</th>
                      <th className="py-1.5 px-3 w-32">Total ($)</th>
                      <th className="py-1.5 px-3 w-12 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/70">
                        <td className="py-1 px-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleProductChange(item.id, "name", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[12px] text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                          />
                        </td>
                        <td className="py-1 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleProductChange(item.id, "qty", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[12px] text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                          />
                        </td>
                        <td className="py-1 px-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleProductChange(item.id, "price", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded px-2 py-0.5 text-[12px] text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                          />
                        </td>
                        <td className="py-1 px-3 font-bold text-slate-900">
                          ${parseFloat(item.total).toFixed(2)}
                        </td>
                        <td className="py-1 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === "total" && (
            <div className="p-2 sm:p-2.5 bg-slate-50/70 grid grid-cols-1 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Total Gross ($):
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="total"
                    value={totalData.total}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Discount ($):
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="discount"
                    value={totalData.discount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-emerald-800 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Net Amount ($):
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="netAmount"
                    value={totalData.netAmount}
                    onChange={handleTotalChange}
                    className="w-full bg-emerald-50/80 border border-emerald-300 rounded-md px-2.5 py-1 text-[12px] font-bold text-emerald-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Amount in Words:
                </label>
                <div className="relative flex-1">
                  <input
                    type="text"
                    name="amountInWords"
                    value={totalData.amountInWords}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                  />
                </div>
              </div>

              <div className="col-span-1 md:col-span-2 flex items-center gap-1.5 sm:gap-2">
                <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                  Audit Remark:
                </label>
                <div className="relative flex-1">
                  <textarea
                    rows={1}
                    name="remark"
                    value={totalData.remark}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all resize-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Scanned Document Image with Upload controls right here */}
      <div className="w-full mt-2">
        <div className="flex items-center justify-between mb-1.5 text-[12px] flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-slate-600">
            <FileText className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-slate-700">Source Document:</span>
            <span className="font-mono text-[11px] text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 truncate max-w-[200px] sm:max-w-[320px]">
              {imageName || "sample-scanned-doc.jpg"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 hover:text-emerald-700 border border-slate-200 text-slate-700 font-semibold text-[12px] cursor-pointer shadow-2xs transition-colors"
              title="Upload new document image"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              <span>Upload Document</span>
            </button>

            {onOpenImageModal && (
              <button
                type="button"
                onClick={onOpenImageModal}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold text-[12px] cursor-pointer shadow-2xs transition-colors"
                title="Inspect in full modal"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Inspect</span>
              </button>
            )}
          </div>
        </div>

        <div className="w-full overflow-y-auto overflow-x-hidden max-h-[340px] sm:max-h-[calc(100vh-410px)] min-h-[260px] rounded-xl border border-slate-200/90 bg-slate-100/60 shadow-2xs custom-scrollbar">
          <img
            src={currentImage}
            alt={imageName || "Scanned Document"}
            onClick={onOpenImageModal}
            className="w-full h-auto block select-none cursor-pointer hover:opacity-95 transition-opacity"
            title="Click to inspect document in full modal"
          />
        </div>
      </div>
    </form>
  );
}
