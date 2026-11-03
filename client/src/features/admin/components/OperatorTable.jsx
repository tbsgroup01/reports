import React from "react";
import OperatorTableRow from "./OperatorTableRow";

export default function OperatorTable({
  operators,
  filteredOperators,
  onToggleSelectAll,
  onToggleSelectRow,
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
  const isAllSelected = operators.length > 0 && operators.every((o) => o.selected);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-visible relative">
      <div className="overflow-x-auto min-h-[360px]">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
              <th className="py-3.5 pl-5 pr-2 w-10">
                <input
                  type="checkbox"
                  onChange={onToggleSelectAll}
                  checked={isAllSelected}
                  className="rounded text-[#118848] focus:ring-[#118848] cursor-pointer"
                />
              </th>
              <th className="py-3.5 px-3 w-14">ID</th>
              <th className="py-3.5 px-3 min-w-[170px]">Username</th>
              <th className="py-3.5 px-3 min-w-[150px]">Password</th>
              <th className="py-3.5 px-3 min-w-[140px]">Access Level</th>
              <th className="py-3.5 px-3 min-w-[120px]">Status</th>
              <th className="py-3.5 px-3 min-w-[120px]">Access Message</th>
              <th className="py-3.5 px-4 text-right w-28">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredOperators.length === 0 ? (
              <tr>
                <td colSpan="8" className="py-12 text-center text-slate-400">
                  No operators found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredOperators.map((operator) => (
                <OperatorTableRow
                  key={operator.id}
                  operator={operator}
                  onToggleSelect={onToggleSelectRow}
                  onViewDetails={onViewDetails}
                  onTogglePassword={onTogglePassword}
                  onChangeAccessLevel={onChangeAccessLevel}
                  onEdit={onEdit}
                  activeMenuId={activeMenuId}
                  setActiveMenuId={setActiveMenuId}
                  menuRef={menuRef}
                  onGrantAccess={onGrantAccess}
                  onDenyAccess={onDenyAccess}
                  onResetPassword={onResetPassword}
                  onToggleFreeze={onToggleFreeze}
                  onToggleJumble={onToggleJumble}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

