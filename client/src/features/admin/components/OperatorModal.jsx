import React from "react";
import { X } from "lucide-react";

export default function OperatorModal({
  isOpen,
  onClose,
  editingOperator,
  formData,
  setFormData,
  onSubmit,
}) {
  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const generated = "Pass#" + Math.random().toString(36).slice(-6) + "!";
    setFormData((prev) => ({ ...prev, password: generated }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 border border-slate-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
          <h3 className="text-lg font-bold text-slate-900">
            {editingOperator ? "Edit Operator" : "Add New Operator"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={formData.username || ""}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="e.g. operator_john"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#118848] focus:ring-2 focus:ring-[#118848]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email || ""}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. operator@gmail.com"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#118848] focus:ring-2 focus:ring-[#118848]/15"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={formData.password || ""}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="Enter or generate password"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:border-[#118848] focus:ring-2 focus:ring-[#118848]/15"
              />
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl cursor-pointer transition-colors"
              >
                Generate
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Access Level
              </label>
              <select
                value={formData.accessLevel || "Telecom"}
                onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#118848]"
              >
                <option>Telecom</option>
                <option>Medical</option>
                <option>Both</option>
                <option>Select Level</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Status
              </label>
              <select
                value={formData.status || "Active"}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#118848]"
              >
                <option>Active</option>
                <option>Frozen</option>
                <option>Denied</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm font-semibold text-white bg-[#0e6b38] hover:bg-[#0b542c] rounded-xl shadow-xs cursor-pointer transition-colors"
            >
              {editingOperator ? "Update Operator" : "Create Operator"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
