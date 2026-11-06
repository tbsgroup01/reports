import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import ProfileBanner from "./components/details/ProfileBanner";
import InfoCard from "./components/details/InfoCard";
import ReportsTab from "./components/details/ReportsTab";
import ActivityTab from "./components/details/ActivityTab";
import ControlsTab from "./components/details/ControlsTab";
import OperatorModal from "./components/OperatorModal";
import { ArrowLeft, KeyRound, Pencil, Trash2, FileSpreadsheet, Clock, ShieldAlert } from "lucide-react";

export default function OperatorDetails({ operator, onBack, onUpdateOperator, onDeleteOperator, onLogout }) {
  const [currentOp, setCurrentOp] = useState(
    operator || {
      id: 3,
      username: "test",
      email: "test@gmail.com",
      createdAt: "03 Nov 2026, 11:20 AM",
      password: "f(Vz7$=Ely",
      accessLevel: "Medical",
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
    accessLevel: currentOp.accessLevel === "Telecom" ? "Telecom" : "Medical",
    status: currentOp.accountStatus || currentOp.status || "Frozen",
  });

  const handleResetPassword = async () => {
    const suggested = "Pass#" + Math.random().toString(36).slice(-6) + "!";
    const newPass = prompt(`Enter new password for ${currentOp.username}:`, suggested);
    if (!newPass || !newPass.trim()) return;

    try {
      const res = await fetch(`https://api.abdivya.com/api/admin/operators/${currentOp.id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPass.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      const updated = {
        ...currentOp,
        password: newPass.trim(),
        status: currentOp.status === "Pending" ? "Active" : currentOp.status,
      };
      setCurrentOp(updated);
      if (onUpdateOperator) onUpdateOperator(updated);
      alert(data.message || `Password set successfully!\nNew password: ${newPass.trim()}`);
    } catch (err) {
      alert("Failed to update password: " + err.message);
    }
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
      <Navbar onLogoClick={onBack} onLogout={onLogout} />

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
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
                Operator Details
              </h1>
              <p className="text-xs  sm:text-xs m text-slate-500 mt-0.5">
                View operator information, access, status and reports.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={handleResetPassword}
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 active:scale-[0.98] border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-xs  sm:text-xs m font-semibold shadow-2xs transition-all cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-slate-600" />
              Reset Password
            </button>



            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] active:scale-[0.98] text-white px-4 py-2.5 rounded-xl text-xs  sm:text-xs m font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Delete Operator
            </button>
          </div>
        </div>

        {/* Profile & Operator Information Row (50 / 50 split) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 w-full items-stretch">
          <ProfileBanner operator={currentOp} />
          <InfoCard operator={currentOp} />
        </div>

        {/* Full-Width Tab Workspace */}
        <div className="space-y-4 w-full">
          {/* Tab Navigation */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("reports")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs  sm:text-xs m font-semibold transition-all cursor-pointer ${activeTab === "reports"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              Reports
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("activity")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs  sm:text-xs m font-semibold transition-all cursor-pointer ${activeTab === "activity"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
            >
              <Clock className="w-4 h-4" />
              Activity Log
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("controls")}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs  sm:text-xs m font-semibold transition-all cursor-pointer ${activeTab === "controls"
                ? "bg-[#0e6b38] text-white shadow-xs"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200"
                }`}
            >
              <ShieldAlert className="w-4 h-4" />
              Access & Controls
            </button>
          </div>

          {/* Tab Panels */}
          {activeTab === "reports" && <ReportsTab operator={currentOp} />}
          {activeTab === "activity" && <ActivityTab />}
          {activeTab === "controls" && (
            <ControlsTab operator={currentOp} onToggleFreeze={handleToggleFreeze} />
          )}
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
