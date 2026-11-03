import React, { useState } from "react";

export default function WorkTab({ onSaveRecord }) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Medical form input fields as defined in specification
  const [formData, setFormData] = useState({
    fileNo: "",
    recordNo: "00000843843",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
    entryDate: todayStr,
    invoiceNo: "SP-l7700IOOI",
    creditCardNo: "",
  });

  // Total tab data (savePayload fields)
  const [totalData, setTotalData] = useState({
    total: "1450.00",
    discount: "50.00",
    netAmount: "1400.00",
    amountInWords: "One Thousand Four Hundred Only",
    remark: "Verified against clinical prescription sheet",
  });

  const [activeSubTab, setActiveSubTab] = useState("sales");

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTotalChange = (e) => {
    const { name, value } = e.target;
    setTotalData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    if (confirm("Clear current Medical form?")) {
      setFormData({
        fileNo: "",
        recordNo: "",
        refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
        entryDate: todayStr,
        invoiceNo: "SP-l7700IOOI",
        creditCardNo: "",
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ...totalData,
      domain: "medical",
      timestamp: new Date().toISOString(),
    };

    if (onSaveRecord) {
      onSaveRecord(payload);
    }

    alert(`Medical Record ${formData.recordNo || "Saved"} entered successfully!`);
    
    // Auto-advance record number
    const num = parseInt(formData.recordNo.replace(/\D/g, "") || "843843", 10) + 1;
    setFormData((prev) => ({
      ...prev,
      recordNo: String(num).padStart(11, "0"),
    }));
  };

  return (
    <div className="space-y-3">
      {/* Sub Tabs: Sales Automation / Product Sale / Total */}
      <div className="flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveSubTab("sales")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "sales"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-b border-slate-200"
          }`}
        >
          📄 Medical Sales Automation
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("product")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "product"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-b border-slate-200"
          }`}
        >
          🛒 Medical Products / Services
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("total")}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "total"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-b border-slate-200"
          }`}
        >
          📊 Total & Net Amount
        </button>
      </div>

      {/* Main Medical Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#e4f3e9] text-[#0e6b38] px-5 py-3 font-bold flex items-center justify-between text-sm border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#0e6b38] text-white flex items-center justify-center text-[10px] font-bold">
              i
            </span>
            <span>Medical Entry Workbench</span>
          </div>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0e6b38]">
            Domain: Medical
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          {activeSubTab === "sales" && (
            <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {/* File No */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  File No
                </label>
                <input
                  type="text"
                  name="fileNo"
                  placeholder="e.g. Med_Batch_01"
                  value={formData.fileNo}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>

              {/* Record No */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  Record No
                </label>
                <input
                  type="text"
                  name="recordNo"
                  required
                  value={formData.recordNo}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 font-semibold focus:outline-none focus:border-[#118848]"
                />
              </div>

              {/* Entry Date */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  Entry Date
                </label>
                <input
                  type="date"
                  name="entryDate"
                  value={formData.entryDate}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>

              {/* Ref No */}
              <div className="flex items-center justify-between gap-3 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  Ref No
                </label>
                <input
                  type="text"
                  name="refNo"
                  value={formData.refNo}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>

              {/* Invoice No */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  Invoice No
                </label>
                <input
                  type="text"
                  name="invoiceNo"
                  value={formData.invoiceNo}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>

              {/* Credit card no */}
              <div className="flex items-center justify-between gap-3">
                <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
                  Credit Card No
                </label>
                <input
                  type="text"
                  name="creditCardNo"
                  placeholder="Card Number"
                  value={formData.creditCardNo}
                  onChange={handleFieldChange}
                  className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                />
              </div>
            </div>
          )}

          {activeSubTab === "product" && (
            <div className="p-6 sm:p-7 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Prescription & Medical Products
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Medication / Treatment</label>
                  <input
                    type="text"
                    defaultValue="Amoxicillin 500mg"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Quantity</label>
                  <input
                    type="number"
                    defaultValue={2}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-600 mb-1">Dosage Schedule</label>
                  <input
                    type="text"
                    defaultValue="Twice Daily (1-0-1)"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "total" && (
            <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-36 shrink-0">
                    Total
                  </label>
                  <input
                    type="text"
                    name="total"
                    value={totalData.total}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-36 shrink-0">
                    Discount
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={totalData.discount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-36 shrink-0">
                    Net Amount
                  </label>
                  <input
                    type="text"
                    name="netAmount"
                    value={totalData.netAmount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-36 shrink-0">
                    Amount in Words
                  </label>
                  <input
                    type="text"
                    name="amountInWords"
                    value={totalData.amountInWords}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800"
                  />
                </div>

                <div className="flex items-start justify-between gap-3">
                  <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-36 shrink-0 pt-2">
                    Remark
                  </label>
                  <textarea
                    rows={2}
                    name="remark"
                    value={totalData.remark}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
            >
              Clear
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => alert("Draft saved!")}
                className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs cursor-pointer"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-xl text-xs shadow-xs cursor-pointer flex items-center gap-2"
              >
                Save & Next →
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

