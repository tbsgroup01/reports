import React, { useState } from "react";
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
} from "lucide-react";

export default function WorkTab({
  domain = "medical",
  onSaveRecord,
  duplicateReportEnabled = false,
  jumbleUpReports = false,
  imageSrc,
  imageName,
  onOpenImageModal,
}) {
  const isTelecom = domain === "telecom";
  const todayStr = new Date().toISOString().split("T")[0];
  const currentImage = imageSrc || sampleDocImg;

  // Primary Form Data matching user spec & scanned sheets
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

  // Product Sale list
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

  // Total Tab fields matching savePayload
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

  // Step 1 -> Step 2 -> Step 3 -> Final Save to DB
  const handleNextStep = (e) => {
    if (e) e.preventDefault();

    if (activeSubTab === "sales_automation") {
      if (!formData.recordNo || !formData.recordNo.trim()) {
        alert("Please enter a Record No before proceeding.");
        return;
      }
      // Redirect to 2nd tab (Product Sale)
      setActiveSubTab("product_sale");
    } else if (activeSubTab === "product_sale") {
      // Calculate totals from line items before advancing
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

      // Redirect to 3rd tab (Total)
      setActiveSubTab("total");
    } else if (activeSubTab === "total") {
      // Store total record to database
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

    // Auto increment record number for next sheet
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

    // Reset total remarks for next document
    setTotalData((prev) => ({
      ...prev,
      discount: "0.00",
      amountInWords: "",
      remark: "",
    }));

    // Redirect back to 1st tab (Sales Automation) ready for next entry
    setActiveSubTab("sales_automation");
  };

  const stepProgress =
    activeSubTab === "sales_automation"
      ? "33.3%"
      : activeSubTab === "product_sale"
        ? "66.6%"
        : "100%";

  return (
    <div className="space-y-0">
      {/* Sub-Tabs: Sales Automation / Product Sale / Total matching screenshot */}
      <div className="w-full overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1 sm:gap-1.5 border-b border-slate-200 min-w-max">
          <button
            type="button"
            onClick={() => setActiveSubTab("sales_automation")}
            className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer rounded-t-xl border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "sales_automation"
                ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
                : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "sales_automation"
                  ? "bg-[#0e6b38] text-white shadow-xs"
                  : "bg-slate-200 text-slate-600"
                }`}
            >
              1
            </span>
            <FileText className={`w-4 h-4 ${activeSubTab === "sales_automation" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Sales Automation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("product_sale")}
            className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer rounded-t-xl border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "product_sale"
                ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
                : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "product_sale"
                  ? "bg-[#0e6b38] text-white shadow-xs"
                  : activeSubTab === "total"
                    ? "bg-emerald-100 text-[#0e6b38]"
                    : "bg-slate-200 text-slate-600"
                }`}
            >
              2
            </span>
            <ShoppingCart className={`w-4 h-4 ${activeSubTab === "product_sale" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Product Sale</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("total")}
            className={`flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer rounded-t-xl border-t-2 -mb-px whitespace-nowrap ${activeSubTab === "total"
                ? "bg-white border-[#0e6b38] text-[#0e6b38] font-bold shadow-2xs border-x border-slate-200"
                : "bg-slate-50/80 hover:bg-slate-100/80 border-transparent text-slate-600 hover:text-slate-900 border-x border-slate-200/40"
              }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-all ${activeSubTab === "total"
                  ? "bg-[#0e6b38] text-white shadow-xs"
                  : "bg-slate-200 text-slate-600"
                }`}
            >
              3
            </span>
            <LayoutGrid className={`w-4 h-4 ${activeSubTab === "total" ? "text-[#0e6b38]" : "text-slate-500"}`} />
            <span>Total</span>
          </button>
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden mt-3">
        {/* Animated Step Progress Bar */}
        <div className="w-full bg-emerald-50 h-1 overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-[#0e6b38] h-full transition-all duration-300 ease-out"
            style={{ width: stepProgress }}
          />
        </div>



        <form onSubmit={handleNextStep}>
          <div key={activeSubTab} className="animate-tab-slide">
            {/* SubTab 1: Sales Automation - 4 Column Compact Layout */}
            {activeSubTab === "sales_automation" && (
              <div className="p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2.5">
                {/* Row 1: File No | Account No | Entry Date | Record No */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    File No
                  </label>
                  <input
                    type="text"
                    name="fileNo"
                    value={formData.fileNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Account No
                  </label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Entry Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="entryDate"
                      value={formData.entryDate}
                      onChange={handleFieldChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Record No
                  </label>
                  <input
                    type="text"
                    name="recordNo"
                    required
                    value={formData.recordNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-[#0e6b38] focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                {/* Row 2: Invoice No | Customer Name | Dispatch No | Dispatch Date */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Invoice No
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Customer Name
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Dispatch No
                  </label>
                  <input
                    type="text"
                    name="dispatchNo"
                    placeholder="e.g. T-4556327260"
                    value={formData.dispatchNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Dispatch Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="dispatchDate"
                      value={formData.dispatchDate}
                      onChange={handleFieldChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 3: Dispatch By | Sales Date | Sales Time | Ref No */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Dispatch By
                  </label>
                  <input
                    type="text"
                    name="dispatchBy"
                    value={formData.dispatchBy}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Sales Date
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="salesDate"
                      value={formData.salesDate}
                      onChange={handleFieldChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                    />
                    <Calendar className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Sales Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="salesTime"
                      value={formData.salesTime}
                      onChange={handleFieldChange}
                      className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                    />
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Ref No
                  </label>
                  <input
                    type="text"
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                {/* Row 4: Email Address | Agent Name | Address (spans 2 cols) */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                {/* Row 5: PIN | Zip | Expiration Remark | Status */}
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    PIN
                  </label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Zip
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Expiration Remark
                  </label>
                  <input
                    type="text"
                    name="expirationRemark"
                    value={formData.expirationRemark}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleFieldChange}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="Digitized">Digitized</option>
                      <option value="Verified">Verified</option>
                      <option value="Pending">Pending</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Row 6: Credit Card Type (2 cols) | Credit Card No (2 cols) */}
                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Credit Card Type
                  </label>
                  <div className="relative">
                    <select
                      name="creditCardType"
                      value={formData.creditCardType}
                      onChange={handleFieldChange}
                      className="w-full appearance-none bg-white border border-slate-200 rounded-xl px-3 py-1.5 pr-8 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs cursor-pointer"
                    >
                      <option value="MasterCard - Platinum Plus">MasterCard - Platinum Plus</option>
                      <option value="Visa Gold Credit Card">Visa Gold Credit Card</option>
                      <option value="American Express">American Express</option>
                      <option value="Discover">Discover</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Credit Card No
                  </label>
                  <input
                    type="text"
                    name="creditCardNo"
                    value={formData.creditCardNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] focus:ring-1 focus:ring-[#0e6b38] transition-all shadow-2xs font-mono"
                  />
                </div>
              </div>
            )}

            {/* SubTab 2: Product Sale */}
            {activeSubTab === "product_sale" && (
              <div className="p-4 sm:p-6 lg:p-7 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {isTelecom ? "Telecom Plans & Equipment Items" : "Medical Prescription Products"}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isTelecom
                        ? "Record itemized devices, data plans, and add-on services."
                        : "Record itemized medications, doses, and clinical billables."}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 bg-[#0e6b38] text-white rounded-xl text-xs font-semibold hover:bg-[#0b542c] cursor-pointer shadow-xs self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-700 font-bold uppercase text-[11px]">
                        <th className="py-3 px-4">Item Description</th>
                        <th className="py-3 px-4 w-28">Quantity</th>
                        <th className="py-3 px-4 w-36">Unit Price ($)</th>
                        <th className="py-3 px-4 w-36">Total ($)</th>
                        <th className="py-3 px-4 w-16 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {products.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/70">
                          <td className="py-2.5 px-4">
                            <input
                              type="text"
                              value={item.name}
                              onChange={(e) => handleProductChange(item.id, "name", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="number"
                              min="1"
                              value={item.qty}
                              onChange={(e) => handleProductChange(item.id, "qty", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                            />
                          </td>
                          <td className="py-2.5 px-4">
                            <input
                              type="number"
                              step="0.01"
                              value={item.price}
                              onChange={(e) => handleProductChange(item.id, "price", e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0e6b38]"
                            />
                          </td>
                          <td className="py-2.5 px-4 font-bold text-slate-900">
                            ${parseFloat(item.total).toFixed(2)}
                          </td>
                          <td className="py-2.5 px-4 text-right">
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

            {/* SubTab 3: Total */}
            {activeSubTab === "total" && (
              <div className="p-3.5 sm:p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Total Gross ($)
                  </label>
                  <input
                    type="text"
                    name="total"
                    value={totalData.total}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Discount Applied ($)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={totalData.discount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Net Amount Payable ($)
                  </label>
                  <input
                    type="text"
                    name="netAmount"
                    value={totalData.netAmount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-emerald-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-emerald-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Amount in Words
                  </label>
                  <input
                    type="text"
                    name="amountInWords"
                    value={totalData.amountInWords}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs"
                  />
                </div>

                <div className="col-span-1 sm:col-span-2 lg:col-span-4">
                  <label className="block text-[11px] sm:text-xs font-bold text-slate-700 mb-1">
                    Audit Remark
                  </label>
                  <textarea
                    rows={2}
                    name="remark"
                    value={totalData.remark}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#0e6b38] shadow-2xs resize-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Form Actions Footer matching screenshot */}
          <div className="px-4 sm:px-6 py-2.5 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {activeSubTab === "sales_automation" ? (
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs w-full sm:w-auto"
              >
                <RotateCcw className="w-4 h-4 text-slate-600" />
                <span>Clear</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (activeSubTab === "product_sale") setActiveSubTab("sales_automation");
                  if (activeSubTab === "total") setActiveSubTab("product_sale");
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs w-full sm:w-auto"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            )}

            <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs"
              >
                <BookmarkCheck className="w-4 h-4 text-slate-600" />
                <span>Save Draft</span>
              </button>

              {activeSubTab !== "total" ? (
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
                >
                  <span>Save & Next</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md cursor-pointer transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Save & Store Record</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Raw Scanned Document Image directly below form - full width, no frame */}
      <div className="w-full mt-4">
        <img
          src={currentImage}
          alt={imageName || "Scanned Document"}
          onClick={onOpenImageModal}
          className="w-full h-auto block rounded-2xl border border-slate-200/80 shadow-2xs select-none cursor-pointer hover:opacity-95 transition-opacity"
          title="Click to view full inspection modal"
        />
      </div>
    </div>
  );
}
