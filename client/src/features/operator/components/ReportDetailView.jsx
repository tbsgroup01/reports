import React from "react";
import OperatorNavbar from "./OperatorNavbar";
import Navbar from "../../../components/Navbar";
import { ArrowLeft } from "lucide-react";

export default function ReportDetailView({
  reportId = "00000843843",
  level = "medical", // 'medical' or 'telecom'
  isAdmin = false,
  onBack,
}) {
  const isMedical = level === "medical";

  // Mock details for medical or telecom
  const medicalDetails = {
    fileNo: "1",
    recordNo: reportId || "00000843843",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#-00000843843",
    invoiceNo: "SP-l7700IOOI100026",
    entryDate: "2026-11-03",
    accountNo: "TELCORDIA",
    dispatchDate: "2026-11-06",
    salesDate: "1999-10-03",
    salesTime: "12:11:00 PM",
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
    total: "$1,450.00",
    discount: "$50.00",
    netAmount: "$1,400.00",
    amountInWords: "One Thousand Four Hundred Only",
    remark: "Verified against clinical prescription sheet",
  };

  const telecomDetails = {
    fileNo: "TC_Telecom_Batch_01",
    recordNo: reportId || "001",
    invoiceNo: "TC_vd-Sdi-IB-BtunVp-0098234e",
    refNo: "TC-REF-9921",
    entryDate: "2026-11-03",
    invoiceDate: "2026-11-03",
    phoneNo: "(555) 234-5678",
    pricePlans: "Unlimited 5G Plus",
    deviceName: "iPhone 15 Pro Max 256GB",
    phoneCost: "$1,199.00",
    monthlyCost: "$75.00",
    mms: "Unlimited",
    texts: "Unlimited",
    extraValueIncluded: "International Roaming Pack",
    customerType: "Personal",
    custName: "Alex Rodriguez",
    initials: "A.R.",
    companyName: "Rodriguez Media",
    custAddress: "742 Evergreen Terrace",
    email: "alex.rodriguez@example.com",
    city: "Springfield",
    state: "OR",
    zip: "97477",
    residenceType: "Own",
    agentNo: "AGT-4091",
    agentName: "Robert Walker",
    agencyCode: "AGC-77",
    agencyName: "Premier Telecom Distribution",
    deposit: "$0.00",
    balance: "$1,199.00",
    creditCardType: "Visa",
    creditCardNo: "4532 9901 2234 1190",
    cardExpiryDate: "08/28",
    creditRate: "Grade A",
    remark: "Standard verification completed",
    status: "Digitized",
  };

  const data = isMedical ? medicalDetails : telecomDetails;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Top Navbar based on role */}
      {isAdmin ? (
        <Navbar onLogoClick={onBack} />
      ) : (
        <OperatorNavbar operatorName="John Doe" role="Operator" onLogout={onBack} />
      )}

      {/* Main Container bounded within max-w-7xl */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  {isAdmin ? "Admin Inspection:" : "Report Inspection:"} {data.recordNo}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs  font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                  {level}
                </span>
                {isAdmin && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-purple-100 text-purple-700">
                    Admin View
                  </span>
                )}
              </div>
              <p className="text-xs  sm:text-xs m text-slate-500 mt-0.5">
                Full digitized transcription report metadata and validation attributes.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold rounded-xl text-xs  sm:text-xs m transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            ← Back to {isAdmin ? "Admin Dashboard" : "Operator Portal"}
          </button>
        </div>

        {/* Data Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-[#e4f3e9] text-[#0e6b38] px-6 py-3 font-bold flex items-center justify-between text-xs  sm:text-xs m border-b border-emerald-100">
            <span>Verified Digitization Attributes</span>
            <span className="font-mono text-xs ">{data.refNo || data.invoiceNo}</span>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs  sm:text-xs m">
            {Object.entries(data).map(([key, val]) => (
              <div key={key} className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {key.replace(/([A-Z])/g, " $1")}
                </div>
                <div className="font-semibold text-slate-900 truncate" title={String(val)}>
                  {String(val) || "—"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
