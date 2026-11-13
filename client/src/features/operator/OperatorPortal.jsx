import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config/api";
import OperatorNavbar from "./components/OperatorNavbar";
import ImageLightboxModal from "./components/ImageLightboxModal";
import MedicalTabs from "./components/medical/MedicalTabs";
import TelecomTabs from "./components/telecom/TelecomTabs";
import { AlertTriangle, Lock, Stethoscope, Radio } from "lucide-react";

const fetchAllReports = async (userId, level) => {
  const pageSize = 500;
  const reports = [];
  let page = 1;
  let pageCount = 1;

  do {
    const params = new URLSearchParams({
      level,
      limit: String(pageSize),
      page: String(page),
    });
    const response = await fetch(
      `${API_BASE_URL}/api/v1/user/get-reports/${userId}?${params}`
    );
    const result = await response.json();
    if (!response.ok || !result.success || !Array.isArray(result.data?.reports)) {
      throw new Error(result.message || `Could not fetch ${level} reports.`);
    }

    reports.push(...result.data.reports);
    pageCount = result.data.pagination?.pages || 1;
    page += 1;
  } while (page <= pageCount);

  return reports;
};

export default function OperatorPortal({ onLogout, initialDomain = "medical" }) {
  // Read authenticated operator from storage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  // Calculate authorized access level from Admin: 'medical' | 'telecom' | 'both'
  const parseAccessLevel = (lvl) => {
    const l = (lvl || "Medical").toLowerCase();
    if (l === "both") return "both";
    if (l === "telecom") return "telecom";
    return "medical";
  };

  const initialJob = parseAccessLevel(currentUser?.accessLevel);
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
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [uploadedDocument, setUploadedDocument] = useState(null);

  useEffect(() => {
    setUploadedDocument(null);
    setIsImageModalOpen(false);
  }, [activeDomain, currentUser?.id, jobType]);

  // Records state for Medical and Telecom
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [telecomRecords, setTelecomRecords] = useState([]);

  // 1. Fetch Real-time Profile & Admin Access Rights
  const syncUserAccess = async () => {
    if (!currentUser?.id) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/user/get-a-user/${currentUser.id}`);
      const json = await res.json();
      if (json.success && json.data?.[0]) {
        const u = json.data[0];
        setCurrentUser((prev) => {
          const updated = { ...prev, ...u };
          try {
            localStorage.setItem("authUser", JSON.stringify(updated));
          } catch { }
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
      const [medical, telecom] = await Promise.all([
        fetchAllReports(currentUser.id, "medical"),
        fetchAllReports(currentUser.id, "telecom"),
      ]);

      setMedicalRecords(medical);
      setTelecomRecords(telecom);
    } catch (err) {
      console.warn("Could not fetch reports from database:", err);
    }
  };

  useEffect(() => {
    syncUserAccess();
    fetchDbReports();

    let eventSource;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/api/admin/operators/stream`);
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
    if (!currentUser?.id) {
      alert("Unable to identify the current operator. Please sign in again before saving.");
      return false;
    }
    if (isFrozen || isDenied) {
      alert("Submission blocked: Your account has been frozen or denied access by an administrator.");
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/medical/medical-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          userId: currentUser.id,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Report could not be saved.");
      }
      const saved = { ...record, ...json.data, id: json.data.id };
      setMedicalRecords((prev) => [saved, ...prev.filter((r) => r.recordNo !== record.recordNo)]);
      alert(`Medical Record #${record.recordNo} saved to database successfully!`);
      return true;
    } catch (err) {
      console.error("Medical report save error:", err);
      alert(`Medical report could not be saved: ${err.message}`);
      return false;
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
          await fetch(`${API_BASE_URL}/api/v1/user/reports/${recordId}`, { method: "DELETE" });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  // Save Telecom Record to MySQL
  const handleSaveTelecomRecord = async (record) => {
    if (!currentUser?.id) {
      alert("Unable to identify the current operator. Please sign in again before saving.");
      return false;
    }
    if (isFrozen || isDenied) {
      alert("Submission blocked: Your account has been frozen or denied access by an administrator.");
      return false;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/v1/telecom/telecom-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...record,
          userId: currentUser.id,
        }),
      });
      const json = await res.json();

      if (!res.ok || !json.success || !json.data) {
        throw new Error(json.message || "Report could not be saved.");
      }
      const saved = { ...record, ...json.data, id: json.data.id };
      setTelecomRecords((prev) => [saved, ...prev.filter((r) => r.recordNo !== record.recordNo)]);
      alert(`Telecom Record #${record.recordNo} saved to database successfully!`);
      return true;
    } catch (err) {
      console.error("Telecom report save error:", err);
      alert(`Telecom report could not be saved: ${err.message}`);
      return false;
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
          await fetch(`${API_BASE_URL}/api/v1/user/reports/${recordId}`, { method: "DELETE" });
        } catch (e) {
          console.warn(e);
        }
      }
    }
  };

  const handleImageSelect = async (file) => {
    if (!file) return;
    if (!currentUser?.id) {
      alert("Unable to identify the current operator. Please sign in again before uploading.");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("userId", String(currentUser.id));
      uploadData.append("file", file);
      const response = await fetch(`${API_BASE_URL}/api/v1/user/upload-document`, {
        method: "POST",
        body: uploadData,
      });
      const result = await response.json();
      if (!response.ok || !result.success || !result.data?.documentUrl) {
        throw new Error(result.message || "Document upload failed.");
      }

      const updatedUser = {
        ...currentUser,
        uploadedDocumentName: result.data.documentName,
        uploadedDocumentUrl: result.data.documentUrl,
      };
      setCurrentUser(updatedUser);
      setUploadedDocument({
        name: result.data.documentName,
        url: result.data.documentUrl,
      });
      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setIsImageModalOpen(true);
    } catch (err) {
      console.error("Could not upload operator document:", err);
      alert(`Could not upload document: ${err.message}`);
    }
  };

  const uploadedDocumentSrc = uploadedDocument?.url
    ? `${API_BASE_URL}${uploadedDocument.url}`
    : null;
  const uploadedDocumentName = uploadedDocument?.name || "";

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
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeDomain === "medical"
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
                  className={`inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeDomain === "telecom"
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
            userId={currentUser?.id}
            imageSrc={uploadedDocumentSrc}
            imageName={uploadedDocumentName}
            onOpenImageModal={uploadedDocumentSrc ? () => setIsImageModalOpen(true) : null}
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
            userId={currentUser?.id}
            imageName={uploadedDocumentName}
            duplicateReportEnabled={duplicateReport}
            jumbleUpReports={jumbleUpReports}
            imageSrc={uploadedDocumentSrc}
            onOpenImageModal={uploadedDocumentSrc ? () => setIsImageModalOpen(true) : null}
            onImageSelect={handleImageSelect}
          />
        )}
      </main>

      {/* Full Document Inspection Lightbox Modal */}
      <ImageLightboxModal
        isOpen={isImageModalOpen}
        imageSrc={uploadedDocumentSrc}
        imageName={uploadedDocumentName}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
}
