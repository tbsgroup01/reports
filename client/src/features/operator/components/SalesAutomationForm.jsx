import React from "react";

export default function SalesAutomationForm({
  formData,
  onChange,
  onClear,
  onSaveDraft,
  onSaveAndNext,
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Green Header Banner */}
      <div className="bg-[#e4f3e9] text-[#0e6b38] px-5 py-3 font-bold flex items-center gap-2 text-sm border-b border-emerald-100">
        <span className="w-4 h-4 rounded-full bg-[#0e6b38] text-white flex items-center justify-center text-[10px] font-bold">
          i
        </span>
        <span>Sales Automation</span>
      </div>

      {/* Form Fields: 3 Responsive Columns */}
      <div className="p-6 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
        
        {/* ================= COLUMN 1 ================= */}
        <div className="space-y-4">
          {/* FILE NO */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              FILE NO
            </label>
            <input
              type="text"
              name="fileNo"
              value={formData.fileNo}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* RECORD NO */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              RECORD NO
            </label>
            <input
              type="text"
              name="recordNo"
              value={formData.recordNo}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* DISPATCH NO */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              DISPATCH NO
            </label>
            <input
              type="text"
              name="dispatchNo"
              value={formData.dispatchNo}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* SALES DATE */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              SALES DATE
            </label>
            <div className="relative w-full">
              <input
                type="date"
                name="salesDate"
                value={formData.salesDate}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
              />
            </div>
          </div>

          {/* EMAIL ADDRESS */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* PIN */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              PIN
            </label>
            <input
              type="text"
              name="pin"
              value={formData.pin}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* EXPIRATION REMARK */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              EXPIRATION REMARK
            </label>
            <input
              type="text"
              name="expirationRemark"
              value={formData.expirationRemark}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>
        </div>

        {/* ================= COLUMN 2 ================= */}
        <div className="space-y-4">
          {/* ACCOUNT NO */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              ACCOUNT NO
            </label>
            <input
              type="text"
              name="accountNo"
              value={formData.accountNo}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* INVOICE NO */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              INVOICE NO
            </label>
            <input
              type="text"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* DISPATCH DATE */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              DISPATCH DATE
            </label>
            <div className="relative w-full">
              <input
                type="date"
                name="dispatchDate"
                value={formData.dispatchDate}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
              />
            </div>
          </div>

          {/* SALES TIME */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              SALES TIME
            </label>
            <div className="relative w-full">
              <input
                type="time"
                name="salesTime"
                value={formData.salesTime}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
              />
            </div>
          </div>

          {/* AGENT NAME */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              AGENT NAME
            </label>
            <input
              type="text"
              name="agentName"
              value={formData.agentName}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* STATUS */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              STATUS
            </label>
            <div className="relative w-full">
              <select
                name="status"
                value={formData.status}
                onChange={onChange}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
              >
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Processing">Processing</option>
                <option value="Completed">Completed</option>
                <option value="Rejected">Rejected</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>

          {/* CREDIT CARD TYPE */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              CREDIT CARD TYPE
            </label>
            <div className="relative w-full">
              <select
                name="creditCardType"
                value={formData.creditCardType}
                onChange={onChange}
                className="w-full appearance-none bg-white border border-slate-200 rounded-lg px-3 py-2 pr-8 text-xs sm:text-sm text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
              >
                <option value="">Select Card Type</option>
                <option value="Visa">Visa</option>
                <option value="MasterCard">MasterCard</option>
                <option value="American Express">American Express</option>
                <option value="Discover">Discover</option>
                <option value="Rupay">Rupay</option>
              </select>
              <span className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </div>
          </div>
        </div>

        {/* ================= COLUMN 3 ================= */}
        <div className="space-y-4">
          {/* ENTRY DATE */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              ENTRY DATE
            </label>
            <div className="relative w-full">
              <input
                type="date"
                name="entryDate"
                value={formData.entryDate}
                onChange={onChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
              />
            </div>
          </div>

          {/* CUSTOMER NAME (Primary) */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              CUSTOMER NAME
            </label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* DISPATCH BY */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              DISPATCH BY
            </label>
            <input
              type="text"
              name="dispatchBy"
              value={formData.dispatchBy}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* CUSTOMER NAME (Secondary / Contact) */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              CUSTOMER NAME
            </label>
            <input
              type="text"
              name="customerNameSecondary"
              value={formData.customerNameSecondary}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* ADDRESS */}
          <div className="flex items-start justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0 pt-2">
              ADDRESS
            </label>
            <textarea
              name="address"
              rows={2}
              value={formData.address}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors resize-y"
            />
          </div>

          {/* ZIP */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              ZIP
            </label>
            <input
              type="text"
              name="zip"
              value={formData.zip}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>

          {/* CREDIT CARD FAX */}
          <div className="flex items-center justify-between gap-3">
            <label className="text-xs font-bold text-slate-700 tracking-wider uppercase w-32 shrink-0">
              CREDIT CARD FAX
            </label>
            <input
              type="text"
              name="creditCardFax"
              value={formData.creditCardFax}
              onChange={onChange}
              className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848] focus:ring-1 focus:ring-[#118848] transition-colors"
            />
          </div>
        </div>

      </div>

      {/* Form Footer Action Buttons */}
      <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
        {/* Left: Clear button */}
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 font-semibold px-4 py-2 rounded-xl text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
        >
          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Clear
        </button>

        {/* Right: Save Draft & Save & Next */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onSaveDraft}
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-2xs transition-all cursor-pointer"
          >
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Draft
          </button>

          <button
            type="button"
            onClick={onSaveAndNext}
            className="inline-flex items-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white font-semibold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
          >
            Save & Next
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

    </div>
  );
}

