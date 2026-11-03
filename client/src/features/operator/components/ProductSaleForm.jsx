import React from "react";

export default function ProductSaleForm() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
      <div className="bg-[#e4f3e9] text-[#0e6b38] px-5 py-3 font-bold flex items-center gap-2 text-sm rounded-xl">
        <span>🛒 Product Sale Information</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div>
          <label className="text-xs font-bold text-slate-700 tracking-wider uppercase block mb-1">
            Item Code
          </label>
          <input
            type="text"
            placeholder="e.g. PRD-8821"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 tracking-wider uppercase block mb-1">
            Quantity
          </label>
          <input
            type="number"
            defaultValue={1}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
          />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-700 tracking-wider uppercase block mb-1">
            Unit Price ($)
          </label>
          <input
            type="text"
            placeholder="0.00"
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
          />
        </div>
      </div>
    </div>
  );
}

