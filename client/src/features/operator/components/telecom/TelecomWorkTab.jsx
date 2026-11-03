import React, { useState } from "react";

export default function TelecomWorkTab({
  imageName = "TC_Batch_Scan_01.jpg",
  duplicateReportEnabled = false,
  onSaveRecord,
}) {
  const todayStr = new Date().toISOString().split("T")[0];

  // Exactly 32 fields specified in the user's requirements
  const [formData, setFormData] = useState({
    // Prefills
    fileNo: imageName || "TC_Telecom_Batch_01",
    recordNo: "001",
    invoiceNo: "TC_vd-Sdi-IB-BtunVp-00",
    invoiceDate: todayStr,

    // Device & Plans
    phoneNo: "",
    pricePlans: "Unlimited 5G Plus",
    deviceName: "iPhone 15 Pro Max 256GB",
    phoneCost: "1199.00",
    monthlyCost: "75.00",
    mms: "Unlimited",
    texts: "Unlimited",
    extraValueIncluded: "International Roaming Pack",

    // Customer Info
    customerType: "Personal",
    custName: "",
    initials: "",
    companyName: "",
    custAddress: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    residenceType: "Own",

    // Agency & Agent
    agentNo: "AGT-4091",
    agentName: "Robert Walker",
    agencyCode: "AGC-77",
    agencyName: "Premier Telecom Distribution",

    // Financial & Card
    deposit: "0.00",
    balance: "1199.00",
    creditCardType: "Visa",
    creditCardNo: "",
    cardExpiryDate: "",
    creditRate: "Grade A",
    remark: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    if (confirm("Clear current Telecom form?")) {
      setFormData((prev) => ({
        ...prev,
        phoneNo: "",
        custName: "",
        initials: "",
        companyName: "",
        custAddress: "",
        email: "",
        city: "",
        state: "",
        zip: "",
        creditCardNo: "",
        cardExpiryDate: "",
        remark: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      domain: "telecom",
      timestamp: new Date().toISOString(),
    };

    if (onSaveRecord) {
      onSaveRecord(payload);
      if (duplicateReportEnabled) {
        // Submit duplicate if enabled
        onSaveRecord({
          ...payload,
          recordNo: payload.recordNo + "_DUP",
        });
      }
    }

    alert(
      duplicateReportEnabled
        ? `Telecom Record ${formData.recordNo} submitted with Duplicate Report mode enabled (2 entries created)!`
        : `Telecom Record ${formData.recordNo} submitted successfully!`
    );

    // Increment record number
    const num = parseInt(formData.recordNo.replace(/\D/g, "") || "1", 10) + 1;
    setFormData((prev) => ({
      ...prev,
      recordNo: String(num).padStart(3, "0"),
      phoneNo: "",
      custName: "",
      email: "",
      creditCardNo: "",
    }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Telecom Header Banner */}
      <div className="bg-[#e4f3e9] text-[#0e6b38] px-5 py-3 font-bold flex items-center justify-between text-sm border-b border-emerald-100">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-[#0e6b38] text-white flex items-center justify-center text-[10px] font-bold">
            T
          </span>
          <span>Telecom CAF & Plan Entry Workbench</span>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#0e6b38]">
          Domain: Telecom (32 Fields)
        </span>
      </div>

      <form onSubmit={handleSubmit} className="divide-y divide-slate-100">
        
        {/* Section 1: Identification & Prefills */}
        <div className="p-5 sm:p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            1. Document & Invoice Identifiers
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                File No
              </label>
              <input
                type="text"
                name="fileNo"
                value={formData.fileNo}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Record No
              </label>
              <input
                type="text"
                name="recordNo"
                required
                value={formData.recordNo}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-emerald-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Invoice No
              </label>
              <input
                type="text"
                name="invoiceNo"
                value={formData.invoiceNo}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Invoice Date
              </label>
              <input
                type="date"
                name="invoiceDate"
                value={formData.invoiceDate}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Device & Plan Details */}
        <div className="p-5 sm:p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            2. Device & Plan Specifications
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Phone No
              </label>
              <input
                type="tel"
                name="phoneNo"
                placeholder="(555) 000-0000"
                value={formData.phoneNo}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Price Plans
              </label>
              <input
                type="text"
                name="pricePlans"
                value={formData.pricePlans}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Device Name
              </label>
              <input
                type="text"
                name="deviceName"
                value={formData.deviceName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Phone Cost ($)
              </label>
              <input
                type="text"
                name="phoneCost"
                value={formData.phoneCost}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Monthly Cost ($)
              </label>
              <input
                type="text"
                name="monthlyCost"
                value={formData.monthlyCost}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                MMS
              </label>
              <input
                type="text"
                name="mms"
                value={formData.mms}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Texts
              </label>
              <input
                type="text"
                name="texts"
                value={formData.texts}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Extra Value Included
              </label>
              <input
                type="text"
                name="extraValueIncluded"
                value={formData.extraValueIncluded}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Customer Information */}
        <div className="p-5 sm:p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            3. Customer & Demographic Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Customer Type
              </label>
              <select
                name="customerType"
                value={formData.customerType}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              >
                <option>Personal</option>
                <option>Business</option>
                <option>Corporate</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Cust Name
              </label>
              <input
                type="text"
                name="custName"
                placeholder="Full Customer Name"
                value={formData.custName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Initials
              </label>
              <input
                type="text"
                name="initials"
                placeholder="e.g. J.D."
                value={formData.initials}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Optional"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Cust Address
              </label>
              <input
                type="text"
                name="custAddress"
                placeholder="Street Address"
                value={formData.custAddress}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="customer@email.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Zip
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Residence Type
              </label>
              <select
                name="residenceType"
                value={formData.residenceType}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#118848]"
              >
                <option>Own</option>
                <option>Rented</option>
                <option>Company Provided</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Agency & Agent */}
        <div className="p-5 sm:p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            4. Agency & Agent Attribution
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Agent No
              </label>
              <input
                type="text"
                name="agentNo"
                value={formData.agentNo}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Agent Name
              </label>
              <input
                type="text"
                name="agentName"
                value={formData.agentName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Agency Code
              </label>
              <input
                type="text"
                name="agencyCode"
                value={formData.agencyCode}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Agency Name
              </label>
              <input
                type="text"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Financials & Payment */}
        <div className="p-5 sm:p-6 space-y-3">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            5. Payment & Security Attributes
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Deposit ($)
              </label>
              <input
                type="text"
                name="deposit"
                value={formData.deposit}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Balance ($)
              </label>
              <input
                type="text"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-emerald-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Credit Card Type
              </label>
              <select
                name="creditCardType"
                value={formData.creditCardType}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              >
                <option>Visa</option>
                <option>MasterCard</option>
                <option>American Express</option>
                <option>Discover</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Credit Card No
              </label>
              <input
                type="text"
                name="creditCardNo"
                placeholder="4054 8374 8117 8579"
                value={formData.creditCardNo}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Card Expiry Date
              </label>
              <input
                type="text"
                name="cardExpiryDate"
                placeholder="MM/YY"
                value={formData.cardExpiryDate}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Credit Rate
              </label>
              <input
                type="text"
                name="creditRate"
                value={formData.creditRate}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                Remark
              </label>
              <input
                type="text"
                name="remark"
                placeholder="Operator verification remark"
                value={formData.remark}
                onChange={handleChange}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-white flex items-center justify-between">
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
  );
}

