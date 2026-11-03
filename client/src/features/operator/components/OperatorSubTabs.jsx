import React from "react";
import { FileText, ShoppingCart, Calculator } from "lucide-react";

export default function OperatorSubTabs({ activeSubTab, onSubTabChange }) {
  const subTabs = [
    {
      id: "sales_automation",
      label: "Sales Automation",
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: "product_sale",
      label: "Product Sale",
      icon: <ShoppingCart className="w-4 h-4" />,
    },
    {
      id: "total",
      label: "Total",
      icon: <Calculator className="w-4 h-4" />,
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
            <span>{st.label}</span>
          </button>
        );
      })}
    </div>
  );
}
