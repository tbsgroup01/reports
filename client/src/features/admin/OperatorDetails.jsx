import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import ProfileBanner from "./components/details/ProfileBanner";
import InfoCard from "./components/details/InfoCard";
import ReportsTab from "./components/details/ReportsTab";
import ActivityTab from "./components/details/ActivityTab";
import ControlsTab from "./components/details/ControlsTab";
import OperatorModal from "./components/OperatorModal";

export default function OperatorDetails({ operator, onBack, onUpdateOperator, onDeleteOperator }) {
  const [currentOp, setCurrentOp] = useState(
    operator || {
      id: 3,
      username: "test",
      email: "test@gmail.com",
      createdAt: "03 Nov 2026, 11:20 AM",
      password: "f(Vz7$=Ely",
      accessLevel: "Both",
      reportModel: "Medical",
      accountStatus: "Frozen",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: ["FROZEN", "JUMBLED"],
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    }
  );

  const [activeTab, setActiveTab] = useState("reports");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    username: currentOp.username,
    password: currentOp.password,
    accessLevel: currentOp.accessLevel || "Both",
    status: currentOp.accountStatus || currentOp.status || "Frozen",
  });

  const handleResetPassword = () => {
    const newPass = "Temp#" + Math.random().toString(36).slice(-6) + "!";
    const updated = { ...currentOp, password: newPass };
    setCurrentOp(updated);
    if (onUpdateOperator) onUpdateOperator(updated);
    alert(`Password reset successfully!\nNew temporary password: ${newPass}`);
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete operator "${currentOp.username}"?`)) {
      if (onDeleteOperator) onDeleteOperator(currentOp.id);
      onBack();
    }
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    const updated = {
      ...currentOp,
      username: editForm.username,
      password: editForm.password,
      accessLevel: editForm.accessLevel,
      accountStatus: editForm.status,
      status: editForm.status,
    };
    setCurrentOp(updated);
    if (onUpdateOperator) onUpdateOperator(updated);
    setIsEditModalOpen(false);
  };

  const handleToggleFreeze = () => {
    const isFrozen = currentOp.accountStatus === "Frozen" || currentOp.status === "Frozen";
    const nextStatus = isFrozen ? "Active" : "Frozen";
    const updated = {
      ...currentOp,
      accountStatus: nextStatus,
      status: nextStatus,
      badges: isFrozen
        ? currentOp.badges?.filter((b) => b !== "FROZEN") || []
        : [...(currentOp.badges || []), "FROZEN"],
    };
    setCurrentOp(updated);
    if (onUpdateOperator) onUpdateOperator(updated);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Shared Navbar bounded inside container */}
      <Navbar onLogoClick={onBack} />

      {/* Main Content Frame */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer shadow-2xs"
              title="Back to Operator List"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
                Operator Details
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                View operator information, access, status and reports.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetPassword}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
              Reset Password
            </button>

            <button
              type="button"
              onClick={() => {
                setEditForm({
                  username: currentOp.username,
                  password: currentOp.password,
                  accessLevel: currentOp.accessLevel || "Both",
                  status: currentOp.accountStatus || currentOp.status || "Frozen",
                });
                setIsEditModalOpen(true);
              }}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              Edit Operator
            </button>

            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Operator
            </button>
          </div>
        </div>

        {/* Profile & Metric Banner */}
        <ProfileBanner operator={currentOp} />

        {/* Two-Column Grid: Info Card Left + Tab Workspace Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-4">
            <InfoCard operator={currentOp} />
          </div>

          <div className="lg:col-span-8 space-y-4">
            {/* Tab Navigation */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("reports")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "reports"
                    ? "bg-[#0e6b38] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Reports
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("activity")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "activity"
                    ? "bg-[#0e6b38] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Activity Log
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("controls")}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === "controls"
                    ? "bg-[#0e6b38] text-white shadow-xs"
                    : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Access & Controls
              </button>
            </div>

            {/* Tab Panels */}
            {activeTab === "reports" && <ReportsTab />}
            {activeTab === "activity" && <ActivityTab />}
            {activeTab === "controls" && (
              <ControlsTab operator={currentOp} onToggleFreeze={handleToggleFreeze} />
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      <OperatorModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingOperator={currentOp}
        formData={editForm}
        setFormData={setEditForm}
        onSubmit={handleSaveEdit}
      />
    </div>
  );
}
