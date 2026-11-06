import React, { useRef } from "react";
import StatusBadge from "../../../components/StatusBadge";
import OperatorContextMenu from "./OperatorContextMenu";
import { Eye, EyeOff, ChevronDown, Pencil, MoreHorizontal, Mail } from "lucide-react";

export default function OperatorTableRow({
  operator,
  index = 0,
  onToggleSelect,
  onViewDetails,
  onTogglePassword,
  onChangeAccessLevel,
  onEdit,
  activeMenuId,
  setActiveMenuId,
  onGrantAccess,
  onDenyAccess,
  onResetPassword,
  onToggleFreeze,
  onToggleJumble,
  onDelete,
}) {
  const isMenuOpen = activeMenuId === operator.id;
  const buttonRef = useRef(null);

  return (
    <tr
      className={`hover:bg-slate-50/70 transition-colors ${operator.selected ? "bg-emerald-50/40" : ""
        }`}
    >
      {/* Checkbox */}
      <td className="py-3.5 pl-5 pr-2">
        <input
          type="checkbox"
          checked={Boolean(operator.selected)}
          onChange={() => onToggleSelect(operator.id)}
          className="rounded text-[#118848] focus:ring-[#118848] cursor-pointer"
        />
      </td>


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

          {Array.isArray(operator.badges) &&
            operator.badges.map((badge) => (
              <StatusBadge key={badge} status={badge} type="badge" />
            ))}
        </div>
      </td>

      {/* Email */}
      <td className="py-3.5 px-3">
        <div className="flex items-center gap-1.5 text-slate-700 text-xs  sm:text-xs m font-medium">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span
            className="truncate max-w-[210px] text-slate-600 hover:text-slate-900 transition-colors"
            title={operator.email || `${operator.username}@gmail.com`}
          >
            {operator.email || `${operator.username}@gmail.com`}
          </span>
        </div>
      </td>

      {/* Password with Eye Toggle */}
      <td className="py-3.5 px-3">
        <div className="flex items-center justify-between max-w-[150px] bg-slate-50 border border-slate-200/90 rounded-lg px-2.5 py-1.5 text-xs  font-mono">
          <span className="truncate mr-2 text-slate-800">
            {operator.password ? (
              operator.showPassword ? operator.password : "••••••••"
            ) : (
              <span className="text-amber-600 font-sans italic text-[11px] font-medium">Not set</span>
            )}
          </span>
          {operator.password && (
            <button
              type="button"
              onClick={() => onTogglePassword(operator.id)}
              className="text-slate-400 hover:text-slate-700 cursor-pointer shrink-0"
              title={operator.showPassword ? "Hide password" : "Show password"}
            >
              {operator.showPassword ? (
                <Eye className="w-3.5 h-3.5" />
              ) : (
                <EyeOff className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </td>

      {/* Access Level Inline Dropdown */}
      <td className="py-3.5 px-3">
        <div className="relative inline-block w-full max-w-[130px]">
          <select
            value={operator.accessLevel === "Telecom" ? "Telecom" : "Medical"}
            onChange={(e) => onChangeAccessLevel(operator.id, e.target.value)}
            className="w-full appearance-none bg-white hover:bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 pr-7 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-[#118848]"
          >
            <option value="Telecom">Telecom</option>
            <option value="Medical">Medical</option>
          </select>
          <span className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
            <ChevronDown className="w-3.5 h-3.5" />
          </span>
        </div>
      </td>

      {/* Status Badges */}
      <td className="py-3.5 px-3">
        <StatusBadge status={operator.status} />
      </td>

      {/* Actions Buttons */}
      <td className="py-3.5 px-4 text-right">
        <div className="flex items-center justify-end gap-1.5 relative">
          {/* Edit Pencil Button */}
          {/* <button
            type="button"
            onClick={() => onEdit(operator)}
            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            title="Edit Operator"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button> */}

          {/* Context Menu Button ... */}
          <button
            ref={buttonRef}
            type="button"
            onClick={() => setActiveMenuId(isMenuOpen ? null : operator.id)}
            className={`p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 transition-colors cursor-pointer ${isMenuOpen ? "bg-slate-100 border-slate-400 text-slate-900" : ""
              }`}
            title="More Options"
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>

          {/* Portal Popout Context Menu */}
          {isMenuOpen && (
            <OperatorContextMenu
              operator={operator}
              buttonRef={buttonRef}
              onClose={() => setActiveMenuId(null)}
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
