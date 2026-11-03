import React from "react";
import StatusBadge from "../../../components/StatusBadge";
import OperatorContextMenu from "./OperatorContextMenu";

export default function OperatorTableRow({
  operator,
  onToggleSelect,
  onViewDetails,
  onTogglePassword,
  onChangeAccessLevel,
  onEdit,
  activeMenuId,
  setActiveMenuId,
  menuRef,
  onGrantAccess,
  onDenyAccess,
  onResetPassword,
  onToggleFreeze,
  onToggleJumble,
  onDelete,
}) {
  const isMenuOpen = activeMenuId === operator.id;

  return (
    <tr
      className={`hover:bg-slate-50/70 transition-colors ${
        operator.selected ? "bg-emerald-50/40" : ""
      }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 pl-5 pr-2">
        <input
          type="checkbox"
          checked={operator.selected}
          onChange={() => onToggleSelect(operator.id)}
          className="rounded text-[#118848] focus:ring-[#118848] cursor-pointer"
        />
      </td>

      {/* ID */}
      <td className="py-3.5 px-3 font-semibold text-slate-900">{operator.id}</td>

      {/* Username + Badges */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            onClick={() => onViewDetails(operator)}
            title="Click to view operator details"
            className="font-semibold text-slate-800 hover:text-[#118848] transition-colors cursor-pointer hover:underline"
          >
            {operator.username}
          </span>

          {operator.badges?.map((badge) => (
            <StatusBadge key={badge} status={badge} type="badge" />
          ))}
        </div>
      </td>

      {/* Password with Eye Toggle */}
      <td className="py-3.5 px-3">
        <div className="flex items-center justify-between max-w-[150px] bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs font-mono">
          <span className="truncate mr-2 text-slate-800">
            {operator.showPassword ? operator.password : "••••••••"}
          </span>
          <button
            type="button"
            onClick={() => onTogglePassword(operator.id)}
            className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
            title={operator.showPassword ? "Hide password" : "Show password"}
          >
            {operator.showPassword ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
      </td>

      {/* Access Level Inline Dropdown */}
      <td className="py-3.5 px-3">
        <div className="relative inline-block w-full max-w-[130px]">
          <select
            value={operator.accessLevel}
            onChange={(e) => onChangeAccessLevel(operator.id, e.target.value)}
            className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-medium text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
          >
            <option>Telecom</option>
            <option>Medical</option>
            <option>Both</option>
            <option>Select Level</option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
      </td>

      {/* Status Badges */}
      <td className="py-3.5 px-3">
        <StatusBadge status={operator.status} />
      </td>

      {/* Access Message */}
      <td className="py-3.5 px-3 text-slate-400 font-medium">
        {operator.accessMessage || "—"}
      </td>

      {/* Actions Buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 relative">
          {/* Edit Pencil Button */}
          <button
            type="button"
            onClick={() => onEdit(operator)}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Edit Operator"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>

          {/* Context Menu Button ... */}
          <button
            type="button"
            onClick={() => setActiveMenuId(isMenuOpen ? null : operator.id)}
            className={`p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer ${
              isMenuOpen ? "bg-slate-100 border-slate-400" : ""
            }`}
            title="More Options"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="19" cy="12" r="2" />
            </svg>
          </button>

          {/* Popout Context Menu */}
          {isMenuOpen && (
            <OperatorContextMenu
              operator={operator}
              menuRef={menuRef}
              onViewDetails={onViewDetails}
              onGrantAccess={onGrantAccess}
              onDenyAccess={onDenyAccess}
              onResetPassword={onResetPassword}
              onToggleFreeze={onToggleFreeze}
              onToggleJumble={onToggleJumble}
              onDelete={onDelete}
            />
          )}
        </div>
      </td>
    </tr>
  );
}

