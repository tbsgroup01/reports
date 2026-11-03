import React from "react";

export default function OperatorSubTabs({ activeSubTab, onSubTabChange }) {
  const subTabs = [
    {
      id: "sales_automation",
      label: "Sales Automation",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: "product_sale",
      label: "Product Sale",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: "total",
      label: "Total",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto">
      {subTabs.map((st) => {
        const isActive = activeSubTab === st.id;
        return (
          <button
            key={st.id}
            type="button"
            onClick={() => onSubTabChange(st.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-t-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
              isActive
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200 border-b border-slate-200"
            }`}
          >
            {st.icon}
            {st.label}
          </button>
        );
      })}
    </div>
  );
}

