import React, { useState, useEffect } from "react";
import OperatorNavbar from "./components/OperatorNavbar";
import ImageLightboxModal from "./components/ImageLightboxModal";
import sampleDocImg from "../../assets/sample-scanned-doc.jpg";
import MedicalTabs from "./components/medical/MedicalTabs";
import TelecomTabs from "./components/telecom/TelecomTabs";
import { AlertTriangle, Lock, Stethoscope, Radio } from "lucide-react";

const initialMedicalRecords = [
  {
    id: "sample-med-1",
    level: "medical",
    fileNo: "1",
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
];

const initialTelecomRecords = [
  {
    id: "sample-tel-1",
    level: "telecom",
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
];

export default function OperatorPortal({ onLogout, initialDomain = "medical" }) {
  // Read authenticated operator from storage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : { id: 5, username: "abdesh", accessLevel: "Medical" };
    } catch {
      return { id: 5, username: "abdesh", accessLevel: "Medical" };
    }
  });

  // Calculate authorized access level from Admin: 'medical' | 'telecom' | 'both'
  const parseAccessLevel = (lvl) => {
    const l = (lvl || "Medical").toLowerCase();
    if (l === "both") return "both";
    if (l === "telecom") return "telecom";
    return "medical";
  };

  const initialJob = parseAccessLevel(currentUser.accessLevel);
  const [jobType, setJobType] = useState(initialJob);
  const [activeDomain, setActiveDomain] = useState(() => {
    if (initialJob === "telecom") return "telecom";
    if (initialJob === "medical") return "medical";
    return initialDomain || "medical";
  });

  // Spec-defined user behavior flags
  const [duplicateReport, setDuplicateReport] = useState(false);
  const [jumbleUpReports, setJumbleUpReports] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [isDenied, setIsDenied] = useState(false);

  // Review image upload state & live preview
  const [selectedFileName, setSelectedFileName] = useState("sample-scanned-doc.jpg");
  const [customImageSrc, setCustomImageSrc] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // Records state for Medical and Telecom
  const [medicalRecords, setMedicalRecords] = useState(initialMedicalRecords);
  const [telecomRecords, setTelecomRecords] = useState(initialTelecomRecords);

  // 1. Fetch Real-time Profile & Admin Access Rights
  const syncUserAccess = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`https://api.abdivya.com/api/v1/user/get-a-user/${currentUser.id}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        const u = json.data[0];
        setCurrentUser((prev) => {
          const updated = { ...prev, ...u };
          try {
            localStorage.setItem("authUser", JSON.stringify(updated));
          } catch {}
          return updated;
        });

        const authorizedJob = parseAccessLevel(u.accessLevel);
        setJobType(authorizedJob);

        // Lock domain if admin only gave access to one domain
        if (authorizedJob === "medical") {
          setActiveDomain("medical");
        } else if (authorizedJob === "telecom") {
          setActiveDomain("telecom");
        }

        // Sync flags
        setDuplicateReport(!!u.duplicateReport);
        setJumbleUpReports(!!u.jumbleUpReports);
        setIsFrozen(u.status === "Frozen" || u.isFrozen);
        setIsDenied(u.status === "Denied" || u.deniedAccess);
      }
    } catch (err) {
      console.warn("Could not sync operator profile:", err);
    }
  };

  // 2. Fetch Saved Database Records for this Operator
  const fetchDbReports = async () => {
    if (!currentUser?.id) return;
    try {
      const [medRes, telRes] = await Promise.all([
        fetch(`https://api.abdivya.com/api/v1/user/get-reports/${currentUser.id}?level=medical&limit=50`),
        fetch(`https://api.abdivya.com/api/v1/user/get-reports/${currentUser.id}?level=telecom&limit=50`),
      ]);

      const medJson = await medRes.json();
      const telJson = await telRes.json();

      if (medJson.success && Array.isArray(medJson.data?.reports) && medJson.data.reports.length > 0) {
        setMedicalRecords(medJson.data.reports);
      }
      if (telJson.success && Array.isArray(telJson.data?.reports) && telJson.data.reports.length > 0) {
        setTelecomRecords(telJson.data.reports);
      }
    } catch (err) {
      console.warn("Could not fetch reports from database:", err);
    }
  };

  useEffect(() => {
    syncUserAccess();
    fetchDbReports();

    let eventSource;
    try {
      eventSource = new EventSource("https://api.abdivya.com/api/admin/operators/stream");
      eventSource.onmessage = () => {
        syncUserAccess();
        fetchDbReports();
      };
    } catch (e) {
      console.warn("Operator EventSource error:", e);
    }

    return () => {
      if (eventSource) eventSource.close();
    };
  }, [currentUser?.id]);

  // Save Medical Record to MySQL
  const handleSaveMedicalRecord = async (record) => {
    if (isFrozen || isDenied) {
      alert("Submission blocked: Your account has been frozen or denied access by an administrator.");
      return;
    }

    try {
      const res = await fetch("https://api.abdivya.com/api/v1/medical/medical-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          userId: currentUser?.id || 1,
        }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const saved = { ...record, ...json.data, id: json.data.id };
        setMedicalRecords((prev) => [saved, ...prev.filter((r) => r.recordNo !== record.recordNo)]);
        alert(`Medical Record #${record.recordNo} saved to database successfully!`);
      } else {
        // Fallback local update
        setMedicalRecords((prev) => [record, ...prev]);
      }
    } catch (err) {
      console.error("Save error:", err);
      setMedicalRecords((prev) => [record, ...prev]);
    }
  };

  // Update Medical Record
  const handleUpdateMedicalRecord = (updatedRecord) => {
    setMedicalRecords((prev) =>
      prev.map((r) =>
        (r.id && r.id === updatedRecord.id) ||
        (r._id && r._id === updatedRecord.id) ||
        (r.recordNo && r.recordNo === updatedRecord.recordNo)
          ? { ...r, ...updatedRecord }
          : r
      )
    );
  };

  // Delete Medical Record
  const handleDeleteMedicalRecord = async (recNo, recordId) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setMedicalRecords((prev) => prev.filter((r) => (r.recordNo || r["Record No"]) !== recNo));
      if (recordId) {
        try {
          await fetch(`https://api.abdivya.com/api/v1/user/reports/${recordId}`, { method: "DELETE" });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  // Save Telecom Record to MySQL
  const handleSaveTelecomRecord = async (record) => {
    if (isFrozen || isDenied) {
      alert("Submission blocked: Your account has been frozen or denied access by an administrator.");
      return;
    }

    try {
      const res = await fetch("https://api.abdivya.com/api/v1/telecom/telecom-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          userId: currentUser?.id || 1,
        }),
      });
      const json = await res.json();

      if (json.success && json.data) {
        const saved = { ...record, ...json.data, id: json.data.id };
        setTelecomRecords((prev) => [saved, ...prev.filter((r) => r.recordNo !== record.recordNo)]);
        alert(`Telecom Record #${record.recordNo} saved to database successfully!`);
      } else {
        setTelecomRecords((prev) => [record, ...prev]);
      }
    } catch (err) {
      console.error("Save error:", err);
      setTelecomRecords((prev) => [record, ...prev]);
    }
  };

  // Update Telecom Record
  const handleUpdateTelecomRecord = (updatedRecord) => {
    setTelecomRecords((prev) =>
      prev.map((r) =>
        (r.id && r.id === updatedRecord.id) ||
        (r._id && r._id === updatedRecord.id) ||
        (r.recordNo && r.recordNo === updatedRecord.recordNo)
          ? { ...r, ...updatedRecord }
          : r
      )
    );
  };

  // Delete Telecom Record
  const handleDeleteTelecomRecord = async (recNo, recordId) => {
    if (confirm("Are you sure you want to delete this record?")) {
      setTelecomRecords((prev) => prev.filter((r) => (r.recordNo || r["Record No"]) !== recNo));
      if (recordId) {
        try {
          await fetch(`https://api.abdivya.com/api/v1/user/reports/${recordId}`, { method: "DELETE" });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  const handleImageSelect = (file) => {
    if (!file) return;
    setSelectedFileName(file.name);
    try {
      const url = URL.createObjectURL(file);
      setCustomImageSrc(url);
      setIsImageModalOpen(true);
    } catch (err) {
      console.warn("Could not create object URL:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-800 font-sans flex flex-col">
      {/* 1. Header with Real Logged In User, Domain Toggle & Mode Controls */}
      <OperatorNavbar
        operatorName={currentUser?.username || "Operator"}
        role={`Operator (${jobType.toUpperCase()})`}
        onLogout={onLogout}
        jobType={jobType}
        activeDomain={activeDomain}
        onDomainChange={(domain) => {
          if (jobType === "medical" && domain !== "medical") return;
          if (jobType === "telecom" && domain !== "telecom") return;
          setActiveDomain(domain);
        }}
        duplicateReport={duplicateReport}
        onToggleDuplicate={() => setDuplicateReport((prev) => !prev)}
        jumbleUpReports={jumbleUpReports}
        onToggleJumble={() => setJumbleUpReports((prev) => !prev)}
      />

      {/* Account Restrictions Banner (Real-time Alert) */}
      {isFrozen && (
        <div className="bg-amber-500 text-white px-4 py-2 text-xs  font-bold flex items-center justify-center gap-2 shadow-xs">
          <AlertTriangle className="w-4 h-4" />
          <span>Account Frozen: An administrator has temporarily frozen your account permissions.</span>
        </div>
      )}
      {isDenied && (
        <div className="bg-red-600 text-white px-4 py-2 text-xs  font-bold flex items-center justify-center gap-2 shadow-xs">
          <Lock className="w-4 h-4" />
          <span>Access Denied: An administrator has revoked submission privileges for this account.</span>
        </div>
      )}

      {/* 2. Main Workspace Container */}
      <main className="flex-1 pt-1.5 pb-4 px-3 sm:px-6 max-w-7xl 2xl:max-w-[1536px] w-full mx-auto space-y-2">
        {/* Stream Switcher Tab: Medical vs Telecom (Visible ONLY when Admin grants 'both' access) */}
        {jobType === "both" && (
          <div className="flex items-center justify-between gap-3 bg-white px-3 sm:px-5 py-2.5 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider hidden sm:inline">
                Stream / Domain:
              </span>
              <div className="inline-flex items-center p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-inner">
                <button
                  type="button"
                  onClick={() => setActiveDomain("medical")}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDomain === "medical"
                      ? "bg-[#0e6b38] text-white shadow-xs scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Stethoscope className="w-3.5 h-3.5" />
                  <span>Medical Form (21 Fields)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveDomain("telecom")}
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDomain === "telecom"
                      ? "bg-[#0e6b38] text-white shadow-xs scale-[1.02]"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>Telecom Form (33 Fields)</span>
                </button>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="font-semibold text-slate-700">
                Active Stream: {activeDomain === "medical" ? "Medical Prescription Digitization" : "Telecom Contract & Subscriber Digitization"}
              </span>
            </div>
          </div>
        )}
        {activeDomain === "medical" && (
          <MedicalTabs
            admin="no"
            records={medicalRecords}
            onSaveRecord={handleSaveMedicalRecord}
            onDeleteRecord={(recNo, recId) => handleDeleteMedicalRecord(recNo, recId)}
            onUpdateRecord={handleUpdateMedicalRecord}
            duplicateReportEnabled={duplicateReport}
            jumbleUpReports={jumbleUpReports}
            imageSrc={customImageSrc || sampleDocImg}
            imageName={selectedFileName}
            onOpenImageModal={() => setIsImageModalOpen(true)}
            onImageSelect={handleImageSelect}
          />
        )}

        {activeDomain === "telecom" && (
          <TelecomTabs
            admin="no"
            records={telecomRecords}
            onSaveRecord={handleSaveTelecomRecord}
            onDeleteRecord={(recNo, recId) => handleDeleteTelecomRecord(recNo, recId)}
            onUpdateRecord={handleUpdateTelecomRecord}
            imageName={selectedFileName}
            duplicateReportEnabled={duplicateReport}
            jumbleUpReports={jumbleUpReports}
            imageSrc={customImageSrc || sampleDocImg}
            onOpenImageModal={() => setIsImageModalOpen(true)}
            onImageSelect={handleImageSelect}
          />
        )}
      </main>

      {/* Full Document Inspection Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isImageModalOpen}
        imageSrc={customImageSrc || sampleDocImg}
        imageName={selectedFileName}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
