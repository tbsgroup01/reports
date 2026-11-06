import React, { useState, useRef, useEffect } from "react";
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

export const MEDICAL_REF_PREFIX = "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- ";

export const extractRefSuffix = (refNo) => {
  if (refNo === null || refNo === undefined) return "";
  const str = String(refNo);
  const prefixRegex = /^Mb_sales-med-np#-[li1]44604#[li1]i?\s*@as-puc[li1]a#-\s*/i;
  const match = str.match(prefixRegex);
  if (match) {
    return str.slice(match[0].length);
  }
  if (str.startsWith(MEDICAL_REF_PREFIX)) {
    return str.slice(MEDICAL_REF_PREFIX.length);
  }
  return str;
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

  const extractImageNumber = (name) => {
    if (!name) return "1";
    const match = String(name).match(/(\d+)/);
    return match ? String(parseInt(match[1], 10)) : "1";
  };

  const getInitialFormData = (dom) => {
    const isTel = dom === "telecom";
    const today = new Date().toISOString().split("T")[0];
    const defaultFileNo = imageName ? extractImageNumber(imageName) : "1";

    if (isTel) {
      return {
        // Row 1: File no | Record no | Invoice no
        fileNo: defaultFileNo,
        recordNo: "00000843801",
        invoiceNo: "TC-l7700IOOI",
        // Row 2: Invoice date | Phone no | Price Plans
        invoiceDate: "1999-10-03",
        phoneNo: "(505) 391-3151",
        pricePlans: "Unlimited 5G Plus Enterprise",
        // Row 3: Device name | Phone cost | Monthly cost
        deviceName: "iPhone 15 Pro Max 256GB - Titanium",
        phoneCost: "1199.00",
        monthlyCost: "75.00",
        // Row 4: MMS | Texts | Extra value
        mms: "Unlimited",
        texts: "Unlimited",
        extraValueIncluded: "International Roaming Pack",
        // Row 5: Customer Type | Customer Name | Initials
        customerType: "Corporate",
        customerName: "DARRELL TUCKER",
        initials: "DT",
        // Row 6: Company name | Customer Address | Email
        companyName: "CUSTER INC",
        address: "1309 BRIARWOOD DR",
        customerAddress: "1309 BRIARWOOD DR",
        emailAddress: "aguilar@camelbak.com",
        // Row 7: City | State | Zip
        city: "ATLANTIC CITY",
        state: "NJ",
        zip: "94175",
        pin: "94175",
        // Row 8: Residence type | Agent no | Agent name
        residenceType: "Own",
        agentNo: "AG-84867",
        agentName: "Jerry Jolly",
        // Row 9: Agency code | Agency name | Deposit
        agencyCode: "AC-7762",
        agencyName: "ALLEN AGENCY",
        deposit: "150.00",
        // Row 10: Balance | Credit card type | Card no
        balance: "1274.00",
        creditCardType: "MasterCard Gold Card",
        creditCardNo: "6982762337151429",
        // Row 11: Card Expiry date | Credit rate | Remark
        cardExpiryDate: "2028-11-30",
        creditRate: "Grade A (14.5%)",
        remark: "Telecom CAF verified against customer photo ID and credit score grade.",
        // Compatibility & audit fields
        entryDate: today,
        status: "Digitized",
        refNo: "TC_Sales-Tel-Np#-l44604#1I @as-PUC1a#- 00000",
      };
    }

    // Medical: Exact 21 Inputs matching User's Handwritten Notebook sequence
    return {
      // Row 1: File no | Record no | Entry date
      fileNo: defaultFileNo,
      recordNo: "00000843843",
      entryDate: today,
      // Row 2: Ref no | Invoice no | Courier name
      refNo: `${MEDICAL_REF_PREFIX}00000`,
      invoiceNo: "SP-l7700IOOI",
      courierName: "TELCORDIA",
      accountNo: "TELCORDIA",
      // Row 3: Chq no | Dispatch no | Dispatch by
      chqNo: "CHQ-4556327",
      dispatchNo: "T-4556327260",
      dispatchBy: "Harold Jones",
      // Row 4: Sales date | Sales time | Customer name
      salesDate: "1999-10-03",
      salesTime: "12:11 PM",
      customerName: "GWENDOLYN THOMAS",
      // Row 5: EMAIL ADDRESS | Agent Name | Address
      emailAddress: "heathercooper@cox.net",
      agentName: "Michael Saliba",
      address: "132 FENIMORE DR",
      // Row 6: CITY | STATE | ZIP
      city: "BARNEGAT",
      state: "CA",
      zip: "94112",
      pin: "94112",
      // Row 7: CUSTOMER PHONE | Credit card Type | Credit card number
      customerPhone: "(505) 285-5806",
      phoneNo: "(505) 285-5806",
      creditCardType: "MasterCard - Platinum Plus",
      creditCardNo: "4054837481178579",
      status: "Digitized",
      expirationRemark: "19-6 18-2",
    };
  };

  const getInitialProducts = (dom) => {
    return [
      { id: 1, productNo: "10-1", name: "Amoxicillin 500mg Oral Capsule", qty: 2, price: 45.0, total: "90.00" },
      { id: 2, productNo: "9-4", name: "Metformin Hydrochloride 850mg", qty: 1, price: 30.0, total: "30.00" },
      { id: 3, productNo: "7-2", name: "Clinical Physician Consultation", qty: 1, price: 1330.0, total: "1330.00" },
    ];
  };

  const getInitialTotals = (dom) => {
    return dom === "telecom"
      ? {
        total: "1400.00",
        discount: "0.00",
        netAmount: "1400.00",
        amountInWords: "One Thousand Four Hundred Only",
        remark: "Telecom CAF verified against customer photo ID and credit score grade.",
      }
      : {
        total: "1450.00",
        discount: "50.00",
        netAmount: "1400.00",
        amountInWords: "One Thousand Four Hundred Only",
        remark: "Prescription sheet verified against physician registry signature.",
      };
  };

  const [formData, setFormData] = useState(() => getInitialFormData(domain));
  const [products, setProducts] = useState(() => getInitialProducts(domain));
  const [totalData, setTotalData] = useState(() => getInitialTotals(domain));
  const [activeSubTab, setActiveSubTab] = useState("sales_automation");

  // Sync form data and product defaults whenever domain switches between medical and telecom
  useEffect(() => {
    setFormData(getInitialFormData(domain));
    setProducts(getInitialProducts(domain));
    setTotalData(getInitialTotals(domain));
    setActiveSubTab("sales_automation");
  }, [domain]);

  // Sync fileNo with uploaded image number
  useEffect(() => {
    if (imageName) {
      const detectedNum = extractImageNumber(imageName);
      setFormData((prev) => ({
        ...prev,
        fileNo: detectedNum,
      }));
    }
  }, [imageName]);

  // Keep total and netAmount in sync with products
  useEffect(() => {
    const gross = products.reduce((acc, p) => acc + (parseFloat(p.total) || 0), 0);
    const disc = parseFloat(totalData.discount) || 0;
    const net = Math.max(0, gross - disc);

    setTotalData((prev) => ({
      ...prev,
      total: gross.toFixed(2),
      netAmount: net.toFixed(2),
    }));
  }, [products]);

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      // Keep accountNo synced if courierName changes
      ...(name === "courierName" ? { accountNo: value } : {}),
      // Keep phoneNo synced if customerPhone changes
      ...(name === "customerPhone" ? { phoneNo: value } : {}),
      // Keep pin synced if zip changes
      ...(name === "zip" ? { pin: value } : {}),
    }));
  };

  const handleRefSuffixChange = (e) => {
    const rawVal = e.target.value;
    const cleanSuffix = extractRefSuffix(rawVal);
    const fullRefNo = `${MEDICAL_REF_PREFIX}${cleanSuffix}`;
    setFormData((prev) => ({
      ...prev,
      refNo: fullRefNo,
    }));
  };

  const handleTotalChange = (e) => {
    const { name, value } = e.target;
    setTotalData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "discount" || name === "total") {
        const gross = parseFloat(name === "total" ? value : updated.total) || 0;
        const disc = parseFloat(name === "discount" ? value : updated.discount) || 0;
        updated.netAmount = Math.max(0, gross - disc).toFixed(2);
      }
      return updated;
    });
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
        productNo: "",
        name: "",
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
      setFormData((prev) => {
        const cleared = {};
        Object.keys(prev).forEach((k) => {
          if (k === "status") cleared[k] = "Digitized";
          else if (k === "fileNo") cleared[k] = imageName ? extractImageNumber(imageName) : "1";
          else if (k === "refNo") cleared[k] = MEDICAL_REF_PREFIX;
          else if (k === "creditCardType") cleared[k] = isTelecom ? "MasterCard Gold Card" : "MasterCard - Platinum Plus";
          else cleared[k] = "";
        });
        return cleared;
      });
    }
  };

  const handleSaveDraft = () => {
    alert(`Draft saved for ${isTelecom ? "Telecom" : "Medical"} Record No: ${formData.recordNo}`);
  };

  const handleNextStep = (e) => {
    if (e) e.preventDefault();

    // Telecom domain: direct save from work tab without Product Sale & Total steps
    if (isTelecom) {
      if (!formData.recordNo || !formData.recordNo.trim()) {
        alert("Please enter a Record No before saving.");
        return;
      }
      handleFinalSubmit();
      return;
    }

    if (activeSubTab === "sales_automation") {
      if (!formData.recordNo || !formData.recordNo.trim()) {
        alert("Please enter a Record No before proceeding.");
        return;
      }
      setActiveSubTab("product_sale");
    } else if (activeSubTab === "product_sale") {
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
      ...(isTelecom ? {} : totalData),
      products: isTelecom ? [] : products,
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
      refNo: `${MEDICAL_REF_PREFIX}${nextRecNo}`,
      customerName: "",
      emailAddress: "",
      address: "",
      creditCardNo: "",
      ...(isTelecom
        ? {
          customerType: "",
          initials: "",
          companyName: "",
          city: "",
          state: "",
          zip: "",
          deposit: "",
          balance: "",
          cardExpiryDate: "",
          creditRate: "",
          remark: "",
        }
        : {}),
    }));

    if (!isTelecom) {
      setTotalData((prev) => ({
        ...prev,
        discount: "0.00",
        amountInWords: "",
        remark: "",
      }));
    }

    setActiveSubTab("sales_automation");
  };

  const stepProgress = isTelecom
    ? "100%"
    : activeSubTab === "sales_automation"
      ? "33.3%"
      : activeSubTab === "product_sale"
        ? "66.6%"
        : "100%";

  return (
    <form onSubmit={handleNextStep} className="space-y-0">
      {/* Sub-tabs + Top Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {/* Sub-tab 1: Contract Details (Telecom) or Sales Automation (Medical) */}
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
            <FileText
              className={`w-3.5 h-3.5 ${activeSubTab === "sales_automation" ? "text-[#0e6b38]" : "text-slate-500"
                }`}
            />
            <span>{isTelecom ? "Contract Details (33 Fields)" : "Sales Automation (21 Fields)"}</span>
          </button>

          {/* Sub-tab 2 & 3 only for Medical (Telecom saves directly from Work Tab) */}
          {!isTelecom && (
            <>
              {/* Sub-tab 2: Product Sale */}
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
                <ShoppingCart
                  className={`w-3.5 h-3.5 ${activeSubTab === "product_sale" ? "text-[#0e6b38]" : "text-slate-500"
                    }`}
                />
                <span>Product Sale</span>
              </button>

              {/* Sub-tab 3: Total */}
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
                <LayoutGrid
                  className={`w-3.5 h-3.5 ${activeSubTab === "total" ? "text-[#0e6b38]" : "text-slate-500"
                    }`}
                />
                <span>Total</span>
              </button>
            </>
          )}
        </div>

        {/* Top-Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 pb-1.5">
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg border border-slate-200/80 transition-colors cursor-pointer shadow-2xs"
            title="Clear all fields"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span>Clear</span>
          </button>

          {!isTelecom && activeSubTab !== "sales_automation" && (
            <button
              type="button"
              onClick={() => {
                if (activeSubTab === "product_sale") setActiveSubTab("sales_automation");
                if (activeSubTab === "total") setActiveSubTab("product_sale");
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-lg border border-slate-200/90 shadow-2xs transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3 h-3 text-slate-500" />
              <span>Previous</span>
            </button>
          )}

          {isTelecom ? (
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-bold text-white bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Next</span>
            </button>
          ) : activeSubTab !== "total" ? (
            <button
              type="submit"
              className="inline-flex items-center gap-1 px-3.5 py-1 text-[11px] font-bold text-white bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <span>Save & Next</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          ) : (
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-3.5 py-1 text-[11px] font-bold text-white bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] rounded-lg shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Save & Store Record</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Box with Progress Line */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden mt-1.5">
        <div className="w-full bg-emerald-50 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-[#0e6b38] h-full transition-all duration-300 ease-out"
            style={{ width: stepProgress }}
          />
        </div>

        <div key={activeSubTab} className="animate-tab-slide">
          {/* ===================== SUB-TAB 1: DATA ENTRY FORM ===================== */}
          {activeSubTab === "sales_automation" && (
            <div className="p-2 sm:p-2.5 bg-slate-50/70 grid grid-cols-1 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-1.5">
              {/* If domain is Telecom: Exact 33 Inputs (11 Rows x 3 Cols) matching User's Handwritten Notebook */}
              {isTelecom ? (
                <>
                  {/* Row 1: File no | Record no | Invoice no */}
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
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 2: Invoice date | Phone no | Price Plans */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Invoice Date:
                    </label>
                    <div className="relative flex-1 flex items-center group">
                      <input
                        type="text"
                        name="invoiceDate"
                        value={formData.invoiceDate}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                      />
                      <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                        <input
                          type="date"
                          title="Click to select invoice date"
                          value={parseDateToIso(formData.invoiceDate)}
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData((prev) => ({ ...prev, invoiceDate: e.target.value }));
                            }
                          }}
                          onClick={(e) => {
                            try {
                              e.currentTarget.showPicker();
                            } catch { }
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Phone No:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="phoneNo"
                        value={formData.phoneNo}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Price Plans:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="pricePlans"
                        value={formData.pricePlans}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Device name | Phone cost | Monthly cost */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Device Name:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="deviceName"
                        value={formData.deviceName}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Phone Cost:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="phoneCost"
                        value={formData.phoneCost}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Monthly Cost:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="monthlyCost"
                        value={formData.monthlyCost}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 4: MMS | Texts | Extra value */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      MMS:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="mms"
                        value={formData.mms}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Texts:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="texts"
                        value={formData.texts}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Extra Value:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="extraValueIncluded"
                        value={formData.extraValueIncluded}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 5: Customer Type | Customer Name | Initials */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Customer Type:
                    </label>
                    <div className="relative flex-1 flex items-center">
                      <select
                        name="customerType"
                        value={formData.customerType}
                        onChange={handleFieldChange}
                        className="w-full appearance-none bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-7 cursor-pointer"
                      >
                        <option value="Corporate">Corporate</option>
                        <option value="Individual">Individual</option>
                        <option value="Enterprise">Enterprise</option>
                        <option value="Small Business">Small Business</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
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

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Initials:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="initials"
                        value={formData.initials}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 6: Company name | Customer Address | Email */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Company Name:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Customer Address:
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

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Email:
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

                  {/* Row 7: City | State | Zip */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      City:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      State:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
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

                  {/* Row 8: Residence type | Agent no | Agent name */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Residence Type:
                    </label>
                    <div className="relative flex-1 flex items-center">
                      <select
                        name="residenceType"
                        value={formData.residenceType}
                        onChange={handleFieldChange}
                        className="w-full appearance-none bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-7 cursor-pointer"
                      >
                        <option value="Own">Own</option>
                        <option value="Rent">Rent</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Commercial">Commercial</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Agent No:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="agentNo"
                        value={formData.agentNo}
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

                  {/* Row 9: Agency code | Agency name | Deposit */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Agency Code:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="agencyCode"
                        value={formData.agencyCode}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Agency Name:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Deposit:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="deposit"
                        value={formData.deposit}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all font-mono"
                      />
                    </div>
                  </div>

                  {/* Row 10: Balance | Credit card type | Card no */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Balance:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="balance"
                        value={formData.balance}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all font-mono font-bold"
                      />
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
                        <option value="MasterCard Gold Card">MasterCard Gold Card</option>
                        <option value="MasterCard - Platinum Plus">MasterCard - Platinum Plus</option>
                        <option value="MasterCard Titanium">MasterCard Titanium</option>
                        <option value="Visa Gold Credit Card">Visa Gold Credit Card</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Card No:
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

                  {/* Row 11: Card Expiry date | Credit rate | Remark */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Card Expiry Date:
                    </label>
                    <div className="relative flex-1 flex items-center group">
                      <input
                        type="text"
                        name="cardExpiryDate"
                        value={formData.cardExpiryDate}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all pr-8"
                      />
                      <div className="absolute right-1.5 flex items-center justify-center w-6 h-6">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0e6b38] pointer-events-none transition-colors" />
                        <input
                          type="date"
                          title="Click to select card expiry date"
                          value={parseDateToIso(formData.cardExpiryDate)}
                          onChange={(e) => {
                            if (e.target.value) {
                              setFormData((prev) => ({ ...prev, cardExpiryDate: e.target.value }));
                            }
                          }}
                          onClick={(e) => {
                            try {
                              e.currentTarget.showPicker();
                            } catch { }
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Credit Rate:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="creditRate"
                        value={formData.creditRate}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Remark:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="remark"
                        value={formData.remark}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Medical: Exact 21 Inputs (7 Rows x 3 Cols) matching User's Handwritten Notebook */
                <>
                  {/* Row 1: File no | Record no | Entry date */}
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
                            } catch { }
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Row 2: Ref no | Invoice no | Courier name */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Ref No:
                    </label>
                    <div className="relative flex-1 flex items-center rounded-md border border-slate-200/90 bg-white focus-within:border-[#0e6b38] focus-within:ring-1 focus-within:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all overflow-hidden">
                      {/* Safe & Disabled Prefix */}
                      <div
                        className="bg-slate-100 text-slate-600 font-mono text-[10px] sm:text-[11px] font-bold px-2 py-1 select-none border-r border-slate-200/90 shrink-0 whitespace-nowrap cursor-not-allowed"
                        title="Safe & Disabled Reference Prefix (Non-editable)"
                      >
                        <span>Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- </span>
                      </div>
                      {/* Dynamic Entry Input (Aage ki entry) */}
                      <input
                        type="text"
                        name="refNoSuffix"
                        value={extractRefSuffix(formData.refNo)}
                        onChange={handleRefSuffixChange}
                        placeholder="00000"
                        className="w-full bg-white px-2.5 py-1 text-[12px] font-semibold font-mono text-slate-800 focus:outline-none"
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
                      Courier Name:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="courierName"
                        value={formData.courierName}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  {/* Row 3: Chq no | Dispatch no | Dispatch by */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Chq No:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="chqNo"
                        value={formData.chqNo}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Dispatch No:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="dispatchNo"
                        value={formData.dispatchNo}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
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

                  {/* Row 4: Sales date | Sales time | Customer name */}
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
                            } catch { }
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
                            } catch { }
                          }}
                          className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
                        />
                      </div>
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

                  {/* Row 5: EMAIL ADDRESS | Agent Name | Address */}
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

                  {/* Row 6: CITY | STATE | ZIP */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      City:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      State:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
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

                  {/* Row 7: CUSTOMER PHONE | Credit card Type | Credit card number */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Customer Phone:
                    </label>
                    <div className="relative flex-1">
                      <input
                        type="text"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleFieldChange}
                        className="w-full bg-white border border-slate-200/90 rounded-md px-2.5 py-1 text-[12px] font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] shadow-2xs hover:border-slate-300 transition-all"
                      />
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
                        <option value="MasterCard Gold Card">MasterCard Gold Card</option>
                        <option value="MasterCard Titanium">MasterCard Titanium</option>
                        <option value="Visa Gold Credit Card">Visa Gold Credit Card</option>
                        <option value="American Express">American Express</option>
                        <option value="Discover">Discover</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none absolute right-2" />
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[110px] shrink-0 select-none">
                      Credit Card Number:
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
                </>
              )}
            </div>
          )}

          {/* ===================== SUB-TAB 2: PRODUCT SALE (MEDICAL ONLY) ===================== */}
          {/* Matches User Request Exactly: NO | PRODUCT NO | QTY | PRODUCT NAME | RATE | TOTAL | ACTION */}
          {!isTelecom && activeSubTab === "product_sale" && (
            <div className="p-3 sm:p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 flex-wrap gap-2">
                <div>
                  <h4 className="text-[13px] sm:text-sm font-bold text-slate-900">
                    Medical Prescription Products
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Record itemized medications, doses, and clinical billables.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white rounded-lg text-xs font-semibold cursor-pointer shadow-2xs transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-bold uppercase text-[11px] tracking-wider">
                      <th className="py-2.5 px-3 text-center w-14">NO</th>
                      <th className="py-2.5 px-3 text-left w-36">PRODUCT NO</th>
                      <th className="py-2.5 px-3 text-center w-24">QTY</th>
                      <th className="py-2.5 px-3 text-left">PRODUCT NAME</th>
                      <th className="py-2.5 px-3 text-right w-32">RATE</th>
                      <th className="py-2.5 px-3 text-right w-32">TOTAL</th>
                      <th className="py-2.5 px-3 text-center w-20">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {products.map((item, idx) => (
                      <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3 text-center font-bold text-slate-600">
                          {idx + 1}
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.productNo || ""}
                            onChange={(e) => handleProductChange(item.id, "productNo", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38]"
                            placeholder="e.g. 10-1"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleProductChange(item.id, "qty", e.target.value)}
                            className="w-full text-center block bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38]"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleProductChange(item.id, "name", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38]"
                            placeholder="Enter product name..."
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleProductChange(item.id, "price", e.target.value)}
                            className="w-full text-right block bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38]"
                          />
                        </td>
                        <td className="py-2 px-3 text-right font-bold text-slate-900 font-mono text-xs sm:text-sm">
                          {parseFloat(item.total || 0).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors mx-auto block"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ===================== SUB-TAB 3: TOTAL (MEDICAL ONLY) ===================== */}
          {/* Matches Reference Video & Demo: Total Gross, Discount, Net Amount, Amount in Words, Remark */}
          {!isTelecom && activeSubTab === "total" && (
            <div className="p-3 sm:p-5 space-y-4">
              <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-[13px] sm:text-sm font-bold text-slate-900">
                    Financial Totals & Invoice Summary
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Review and verify calculated gross billables, applied discounts, and net totals.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#0e6b38] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Step 3 of 3
                </span>
              </div>

              <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[120px] shrink-0 select-none">
                    Total Gross:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="total"
                      value={totalData.total}
                      onChange={handleTotalChange}
                      className="w-full bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[120px] shrink-0 select-none">
                    Discount:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="discount"
                      value={totalData.discount}
                      onChange={handleTotalChange}
                      className="w-full bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-[11px] font-bold text-emerald-800 whitespace-nowrap w-24 sm:w-[120px] shrink-0 select-none">
                    Net Amount:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="netAmount"
                      value={totalData.netAmount}
                      onChange={handleTotalChange}
                      className="w-full bg-emerald-50/90 border border-emerald-300 rounded-md px-3 py-1.5 text-xs font-mono font-extrabold text-[#0e6b38] focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex items-center gap-2">
                  <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[120px] shrink-0 select-none">
                    Amount in Words:
                  </label>
                  <div className="relative flex-1">
                    <input
                      type="text"
                      name="amountInWords"
                      value={totalData.amountInWords}
                      onChange={handleTotalChange}
                      className="w-full bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                      placeholder="e.g. One Thousand Four Hundred Only"
                    />
                  </div>
                </div>

                <div className="col-span-1 md:col-span-3 flex items-start gap-2">
                  <label className="text-[11px] font-bold text-slate-700 whitespace-nowrap w-24 sm:w-[120px] shrink-0 select-none pt-1.5">
                    Audit Remark:
                  </label>
                  <div className="relative flex-1">
                    <textarea
                      rows={2}
                      name="remark"
                      value={totalData.remark}
                      onChange={handleTotalChange}
                      className="w-full bg-white border border-slate-200/90 rounded-md px-3 py-1.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Scanned Document Image with Upload controls */}
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
