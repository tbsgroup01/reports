import React, { useState } from "react";
import {
  FileText,
  ShoppingCart,
  Calculator,
  Info,
  ArrowRight,
  Plus,
  Trash2,
  Check,
} from "lucide-react";

export default function WorkTab({
  onSaveRecord,
  duplicateReportEnabled = false,
  jumbleUpReports = false,
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Primary Medical Form Data matching user spec & scanned sheets
  const [formData, setFormData] = useState({
    fileNo: "Mb_Sales-Med-Np#-l44604#1I",
    recordNo: "00000843843",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
    entryDate: todayStr,
    invoiceNo: "SP-l7700IOOI",
    accountNo: "TELCORDIA",
    dispatchNo: "T-4556327260",
    dispatchDate: "1999-09-10",
    salesDate: "1999-10-03",
    salesTime: "12:11:00",
    customerName: "GWENDOLYN THOMAS",
    dispatchBy: "Harold Jones",
    agentName: "Michael Saliba",
    emailAddress: "heathercooper@cox.net",
    address: "132 FENIMORE DR BARNEGAT CA",
    pin: "94112",
    zip: "94112",
    status: "Digitized",
    creditCardType: "MasterCard - Platinum Plus",
    creditCardNo: "4054837481178579",
    expirationRemark: "19-6 18-2",
  });

  // Product Sale list
  const [products, setProducts] = useState([
    { id: 1, name: "Amoxicillin 500mg Oral Capsule", qty: 2, price: 45.0, total: 90.0 },
    { id: 2, name: "Metformin Hydrochloride 850mg", qty: 1, price: 30.0, total: 30.0 },
    { id: 3, name: "Clinical Physician Consultation", qty: 1, price: 1330.0, total: 1330.0 },
  ]);

  // Total Tab fields matching savePayload
  const [totalData, setTotalData] = useState({
    total: "1450.00",
    discount: "50.00",
    netAmount: "1400.00",
    amountInWords: "One Thousand Four Hundred Only",
    remark: "Prescription sheet verified against physician registry signature.",
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
      { id: Date.now(), name: "Medical Product / Service", qty: 1, price: 0.0, total: "0.00" },
    ]);
  };

  const handleRemoveProduct = (id) => {
    if (products.length <= 1) return;
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClear = () => {
    if (confirm("Clear current Medical form inputs?")) {
      setFormData({
        fileNo: "",
        recordNo: "",
        refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000",
        entryDate: todayStr,
        invoiceNo: "SP-l7700IOOI",
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
        status: "",
        creditCardType: "",
        creditCardNo: "",
        expirationRemark: "",
      });
    }
  };

  const handleSaveDraft = () => {
    alert(`Draft saved for Medical Record No: ${formData.recordNo}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      ...totalData,
      products,
      domain: "medical",
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

    alert(
      duplicateReportEnabled
        ? `Medical Record ${formData.recordNo} saved with Duplicate Report enabled (2 entries generated)!`
        : `Medical Record ${formData.recordNo} saved successfully!`
    );

    // Auto increment record number
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
  };

  return (
    <div className="space-y-0">
      {/* Sub-Tabs: Sales Automation / Product Sale / Total with Lucide Icons */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 mb-0">
        <button
          type="button"
          onClick={() => setActiveSubTab("sales_automation")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "sales_automation"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-50 border-t border-l border-r border-slate-200"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sales Automation</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("product_sale")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "product_sale"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-50 border-t border-l border-r border-slate-200"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Product Sale</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("total")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
            activeSubTab === "total"
              ? "bg-[#0e6b38] text-white shadow-xs"
              : "bg-white text-slate-700 hover:bg-slate-50 border-t border-l border-r border-slate-200"
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Total</span>
        </button>
      </div>

      {/* Main Medical Card Container */}
      <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Green Notification / Section Bar */}
        <div className="bg-[#e4f3e9] text-[#0e6b38] px-5 py-2.5 font-bold flex items-center justify-between text-xs sm:text-sm border-b border-emerald-100">
          <div className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-[#0e6b38] text-white flex items-center justify-center">
              <Info className="w-2.5 h-2.5" />
            </span>
            <span>
              {activeSubTab === "sales_automation" && "Medical Sales Automation"}
              {activeSubTab === "product_sale" && "Medical Prescription & Products Sale"}
              {activeSubTab === "total" && "Total, Discount & Net Amount Summary"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {jumbleUpReports && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                Jumbled View
              </span>
            )}
            {duplicateReportEnabled && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                2x Duplication Mode
              </span>
            )}
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0e6b38]">
              Domain: Medical
            </span>
          </div>
        </div>

        {/* SubTab Views Form */}
        <form onSubmit={handleSubmit}>
          
          {/* SubTab 1: Sales Automation */}
          {activeSubTab === "sales_automation" && (
            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              
              {/* Column 1 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    FILE NO
                  </label>
                  <input
                    type="text"
                    name="fileNo"
                    value={formData.fileNo}
                    onChange={handleFieldChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    RECORD NO
                  </label>
                  <input
                    type="text"
                    name="recordNo"
                    required
                    value={formData.recordNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    DISPATCH NO
                  </label>
                  <input
                    type="text"
                    name="dispatchNo"
                    placeholder="e.g. T-4556327260"
                    value={formData.dispatchNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    SALES DATE
                  </label>
                  <input
                    type="date"
                    name="salesDate"
                    value={formData.salesDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    EMAIL ADDRESS
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    placeholder="operator@client.com"
                    value={formData.emailAddress}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    PIN
                  </label>
                  <input
                    type="text"
                    name="pin"
                    value={formData.pin}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    EXPIRATION REMARK
                  </label>
                  <input
                    type="text"
                    name="expirationRemark"
                    placeholder="e.g. 19-6 18-2"
                    value={formData.expirationRemark}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>
              </div>

              {/* Column 2 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    ACCOUNT NO
                  </label>
                  <input
                    type="text"
                    name="accountNo"
                    value={formData.accountNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    INVOICE NO
                  </label>
                  <input
                    type="text"
                    name="invoiceNo"
                    value={formData.invoiceNo}
                    onChange={handleFieldChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    DISPATCH DATE
                  </label>
                  <input
                    type="date"
                    name="dispatchDate"
                    value={formData.dispatchDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    SALES TIME
                  </label>
                  <input
                    type="time"
                    name="salesTime"
                    value={formData.salesTime}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    AGENT NAME
                  </label>
                  <input
                    type="text"
                    name="agentName"
                    value={formData.agentName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    STATUS
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  >
                    <option value="Digitized">Digitized</option>
                    <option value="Verified">Verified</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    CREDIT CARD TYPE
                  </label>
                  <select
                    name="creditCardType"
                    value={formData.creditCardType}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  >
                    <option value="MasterCard - Platinum Plus">MasterCard - Platinum Plus</option>
                    <option value="Visa Gold Credit Card">Visa Gold Credit Card</option>
                    <option value="American Express">American Express</option>
                    <option value="Discover">Discover</option>
                  </select>
                </div>
              </div>

              {/* Column 3 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    ENTRY DATE
                  </label>
                  <input
                    type="date"
                    name="entryDate"
                    value={formData.entryDate}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    CUSTOMER NAME
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    DISPATCH BY
                  </label>
                  <input
                    type="text"
                    name="dispatchBy"
                    value={formData.dispatchBy}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    REF NO
                  </label>
                  <input
                    type="text"
                    name="refNo"
                    value={formData.refNo}
                    onChange={handleFieldChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    ADDRESS
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    ZIP
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    CREDIT CARD NO
                  </label>
                  <input
                    type="text"
                    name="creditCardNo"
                    value={formData.creditCardNo}
                    onChange={handleFieldChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm font-mono text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>
              </div>

            </div>
          )}

          {/* SubTab 2: Product Sale */}
          {activeSubTab === "product_sale" && (
            <div className="p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Medical Prescription Products</h4>
                  <p className="text-xs text-slate-500">Record itemized medications, doses, and clinical billables.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0e6b38] text-white rounded-lg text-xs font-semibold hover:bg-[#0b542c] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold uppercase">
                      <th className="py-2.5 px-3">Item Description</th>
                      <th className="py-2.5 px-3 w-28">Quantity</th>
                      <th className="py-2.5 px-3 w-36">Unit Price ($)</th>
                      <th className="py-2.5 px-3 w-36">Total ($)</th>
                      <th className="py-2.5 px-3 w-16 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="py-2 px-3">
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => handleProductChange(item.id, "name", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            min="1"
                            value={item.qty}
                            onChange={(e) => handleProductChange(item.id, "qty", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2 px-3">
                          <input
                            type="number"
                            step="0.01"
                            value={item.price}
                            onChange={(e) => handleProductChange(item.id, "price", e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-md px-2.5 py-1.5 text-xs text-slate-800"
                          />
                        </td>
                        <td className="py-2 px-3 font-semibold text-slate-900">
                          ${parseFloat(item.total).toFixed(2)}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => handleRemoveProduct(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
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
            <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Total Gross ($)
                  </label>
                  <input
                    type="text"
                    name="total"
                    value={totalData.total}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Discount Applied ($)
                  </label>
                  <input
                    type="text"
                    name="discount"
                    value={totalData.discount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Net Amount Payable ($)
                  </label>
                  <input
                    type="text"
                    name="netAmount"
                    value={totalData.netAmount}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-emerald-300 rounded-lg px-3 py-2 text-xs sm:text-sm font-bold text-emerald-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Amount in Words
                  </label>
                  <input
                    type="text"
                    name="amountInWords"
                    value={totalData.amountInWords}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Audit Remark
                  </label>
                  <textarea
                    rows={3}
                    name="remark"
                    value={totalData.remark}
                    onChange={handleTotalChange}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-[#118848]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
          <div className="px-5 sm:px-7 py-3.5 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs"
            >
              Clear
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs sm:text-sm cursor-pointer transition-colors shadow-2xs"
              >
                Save Draft
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0e6b38] hover:bg-[#0b542c] text-white font-semibold rounded-xl text-xs sm:text-sm shadow-xs cursor-pointer flex items-center gap-2 transition-colors"
              >
                <span>Save & Next</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
}
