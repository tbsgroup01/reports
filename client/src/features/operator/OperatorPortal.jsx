import React, { useState } from "react";
import OperatorNavbar from "./components/OperatorNavbar";
import OperatorSubHeader from "./components/OperatorSubHeader";
import MedicalTabs from "./components/medical/MedicalTabs";
import TelecomTabs from "./components/telecom/TelecomTabs";


const initialMedicalRecords = [
  {
    fileNo: "Mb_Sales-Med-Np#-l44604#1I",
    recordNo: "00000843843",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000843843",
    entryDate: "2026-11-03",
    invoiceNo: "SP-l7700IOOI100026",
    accountNo: "TELCORDIA",
    dispatchNo: "T-4556327260",
    customerName: "GWENDOLYN THOMAS",
    agentName: "Michael Saliba",
    creditCardNo: "4054837481178579",
    total: "1450.00",
    netAmount: "1400.00",
    discount: "50.00",
    amountInWords: "One Thousand Four Hundred Only",
    remark: "Verified against clinical prescription sheet",
    status: "Digitized",
  },
  {
    fileNo: "Mb_Sales-Med-Np#-l44604#1I",
    recordNo: "00000792875",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000792875",
    entryDate: "2026-11-02",
    invoiceNo: "SP-l7700IOOI84890",
    accountNo: "TD AMERITRADE",
    dispatchNo: "T-4558050357",
    customerName: "MR FREDERICK E WARD JR",
    agentName: "Ronald Bernard",
    creditCardNo: "6049082434163719",
    total: "2200.00",
    netAmount: "2100.00",
    discount: "100.00",
    amountInWords: "Two Thousand One Hundred Only",
    remark: "Hospital inpatient therapy bill",
    status: "Digitized",
  },
  {
    fileNo: "Mb_Sales-Med-Np#-l44604#1I",
    recordNo: "00000807010",
    refNo: "Mb_Sales-Med-Np#-l44604#1I @as-PUC1a#- 00000807010",
    entryDate: "2026-11-01",
    invoiceNo: "SP-l7700IOOI84891",
    accountNo: "WILLIAMS SCOTSMAN",
    dispatchNo: "W-4566074900",
    customerName: "CLAYTON I MIURA 1103",
    agentName: "Dorothy B. Portalla",
    creditCardNo: "2917129404111513",
    total: "870.00",
    netAmount: "870.00",
    discount: "0.00",
    amountInWords: "Eight Hundred Seventy Only",
    remark: "Regular pharmacy refill",
    status: "Digitized",
  },
];

const initialTelecomRecords = [
  {
    fileNo: "TC_Telecom_Batch_01",
    recordNo: "001",
    invoiceNo: "TC_vd-Sdi-IB-BtunVp-00",
    refNo: "TC-REF-9921",
    entryDate: "2026-11-03",
    invoiceDate: "2026-11-03",
    phoneNo: "(555) 234-5678",
    pricePlans: "Unlimited 5G Plus",
    deviceName: "iPhone 15 Pro Max 256GB",
    phoneCost: "1199.00",
    monthlyCost: "75.00",
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
    deposit: "0.00",
    balance: "1199.00",
    creditCardType: "Visa",
    creditCardNo: "4532 9901 2234 1190",
    cardExpiryDate: "08/28",
    creditRate: "Grade A",
    remark: "Standard verification completed",
    status: "Digitized",
  },
  {
    fileNo: "TC_Telecom_Batch_01",
    recordNo: "002",
    invoiceNo: "TC_vd-Sdi-IB-BtunVp-01",
    refNo: "TC-REF-9922",
    entryDate: "2026-11-02",
    invoiceDate: "2026-11-02",
    phoneNo: "(555) 876-5432",
    pricePlans: "Family 4-Line Bundle",
    deviceName: "Samsung Galaxy S24 Ultra",
    phoneCost: "1299.00",
    monthlyCost: "120.00",
    mms: "Unlimited",
    texts: "Unlimited",
    extraValueIncluded: "Cloud Storage 2TB",
    customerType: "Personal",
    custName: "Sarah Jenkins",
    initials: "S.J.",
    companyName: "Jenkins Logistics",
    custAddress: "1204 Pinecone Blvd",
    email: "sjenkins@gmail.com",
    city: "Seattle",
    state: "WA",
    zip: "98101",
    residenceType: "Own",
    agentNo: "AGT-4091",
    agentName: "Robert Walker",
    agencyCode: "AGC-77",
    agencyName: "Premier Telecom Distribution",
    deposit: "100.00",
    balance: "1199.00",
    creditCardType: "MasterCard",
    creditCardNo: "5412 7531 9900 4421",
    cardExpiryDate: "11/27",
    creditRate: "Grade A+",
    remark: "Port-in from competitor verified",
    status: "Digitized",
  },
];

export default function OperatorPortal({ onLogout, initialDomain = "medical" }) {
  // Domain selection when Job: both
  const [jobType] = useState("both"); // "both" | "medical" | "telecom"
  const [activeDomain, setActiveDomain] = useState(initialDomain); // "medical" or "telecom"

  // Sync if initialDomain prop changes
  React.useEffect(() => {
    if (initialDomain && initialDomain !== activeDomain) {
      setActiveDomain(initialDomain);
    }
  }, [initialDomain]);

  // Spec-defined user behavior flags
  const [duplicateReport, setDuplicateReport] = useState(false);
  const [jumbleUpReports, setJumbleUpReports] = useState(false);

  // Review image upload state
  const [selectedFileName, setSelectedFileName] = useState("sample-scanned-doc.jpg");

  // Records state for Medical and Telecom
  const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);
  const [telecomRecords, setTelecomRecords] = useState(initialTelecomRecords);

  // Save Record Handlers
  const handleSaveMedicalRecord = (record) => {
    setMedicalRecords((prev) => {
      const existsIndex = prev.findIndex(
        (r) => (r.recordNo || r["Record No"]) === (record.recordNo || record["Record No"])
      );
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = record;
        return updated;
      }
      return [record, ...prev];
    });
  };

  const handleDeleteMedicalRecord = (recNo) => {
    setMedicalRecords((prev) =>
      prev.filter((r) => (r.recordNo || r["Record No"]) !== recNo)
    );
  };

  const handleSaveTelecomRecord = (record) => {
    setTelecomRecords((prev) => {
      const existsIndex = prev.findIndex(
        (r) => (r.recordNo || r["Record No"]) === (record.recordNo || record["Record No"])
      );
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = record;
        return updated;
      }
      return [record, ...prev];
    });
  };

  const handleDeleteTelecomRecord = (recNo) => {
    setTelecomRecords((prev) =>
      prev.filter((r) => (r.recordNo || r["Record No"]) !== recNo)
    );
  };

  const handleImageSelect = (file) => {
    setSelectedFileName(file.name);
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans flex flex-col">
      {/* 1. Dark Top Header */}
      <OperatorNavbar
        operatorName="John Doe"
        role="Operator"
        onLogout={onLogout}
      />

      {/* 2. Sub-Header: Job type badge, Domain Selector (Medical / Telecom), Behavior Flags, Review Image, Logout */}
      <OperatorSubHeader
        jobType={jobType}
        activeDomain={activeDomain}
        onDomainChange={setActiveDomain}
        duplicateReport={duplicateReport}
        onToggleDuplicate={() => setDuplicateReport((prev) => !prev)}
        jumbleUpReports={jumbleUpReports}
        onToggleJumble={() => setJumbleUpReports((prev) => !prev)}
        selectedImageName={selectedFileName}
        onImageSelect={handleImageSelect}
        onLogout={onLogout}
      />

      {/* 3. Main Workspace Container bounded to frame (never spills out) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-4">
        {activeDomain === "medical" && (
          <MedicalTabs
            admin="no"
            records={medicalRecords}
            onSaveRecord={handleSaveMedicalRecord}
            onDeleteRecord={handleDeleteMedicalRecord}
            duplicateReportEnabled={duplicateReport}
            jumbleUpReports={jumbleUpReports}
          />
        )}

        {activeDomain === "telecom" && (
          <TelecomTabs
            admin="no"
            records={telecomRecords}
            onSaveRecord={handleSaveTelecomRecord}
            onDeleteRecord={handleDeleteTelecomRecord}
            imageName={selectedFileName}
            duplicateReportEnabled={duplicateReport}
            jumbleUpReports={jumbleUpReports}
          />
        )}
      </main>
    </div>
  );
}
