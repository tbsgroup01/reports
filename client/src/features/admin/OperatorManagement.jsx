import React, { useState, useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import OperatorMetrics from "./components/OperatorMetrics";
import OperatorToolbar from "./components/OperatorToolbar";
import OperatorTable from "./components/OperatorTable";
import OperatorPagination from "./components/OperatorPagination";
import OperatorModal from "./components/OperatorModal";
import OperatorDetails from "./OperatorDetails";
import { Plus } from "lucide-react";

export default function OperatorManagement({ onLogout, initialOperatorId }) {
  const [selectedOperatorDetails, setSelectedOperatorDetails] = useState(null);

  // Initial Operators matching screenshot
  const [operators, setOperators] = useState([
    {
      id: 1,
      username: "abdesh",
      email: "abdesh@gmail.com",
      password: "Nh#su3Q+qt",
      showPassword: true,
      accessLevel: "Medical",
      reportModel: "Medical",
      status: "Active",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: ["JUMBLED"],
      accessMessage: "—",
      selected: false,
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    },
    {
      id: 2,
      username: "sdgdfgdfh",
      email: "sdgdfgdfh@gmail.com",
      password: "xK9!mP2#wL",
      showPassword: false,
      accessLevel: "Telecom",
      reportModel: "Telecom",
      status: "Active",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: [],
      accessMessage: "—",
      selected: false,
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    },
    {
      id: 3,
      username: "test",
      email: "test@gmail.com",
      createdAt: "03 Nov 2026, 11:20 AM",
      password: "f(Vz7$=Ely",
      showPassword: true,
      accessLevel: "Both",
      reportModel: "Medical",
      status: "Frozen",
      accountStatus: "Frozen",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: ["FROZEN", "JUMBLED"],
      accessMessage: "—",
      selected: false,
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    },
    {
      id: 4,
      username: "prakhar",
      email: "prakhar@gmail.com",
      password: "9@vT8#qR1x",
      showPassword: false,
      accessLevel: "Select Level",
      reportModel: "Telecom",
      status: "Denied",
      accountStatus: "Denied",
      dataStatus: "Clean",
      deniedAccess: "Yes",
      badges: [],
      accessMessage: "—",
      selected: false,
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    },
    {
      id: 5,
      username: "kush",
      email: "kush@gmail.com",
      password: "9LZ-ktrx1H",
      showPassword: true,
      accessLevel: "Telecom",
      reportModel: "Telecom",
      status: "Active",
      dataStatus: "Clean",
      deniedAccess: "No",
      badges: [],
      accessMessage: "—",
      selected: false,
      totalReports: 0,
      validRecords: 0,
      deletedRecords: 0,
    },
  ]);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [accessFilter, setAccessFilter] = useState("All Access Level");

  // Context Menu State
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    accessLevel: "Telecom",
    status: "Active",
  });

  // Close context menu on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Preselect operator if initialOperatorId provided
  useEffect(() => {
    if (initialOperatorId) {
      const found = operators.find(
        (op) => String(op.id) === String(initialOperatorId) || op.username.toLowerCase() === String(initialOperatorId).toLowerCase()
      );
      if (found) {
        setSelectedOperatorDetails(found);
      }
    }
  }, [initialOperatorId, operators]);

  // Keyboard shortcut Ctrl + K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        document.getElementById("operator-table-search")?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Compute Metrics
  const totalCount = operators.length;
  const activeCount = operators.filter((o) => o.status === "Active").length;
  const frozenCount = operators.filter(
    (o) => o.status === "Frozen" || o.badges.includes("FROZEN")
  ).length;
  const jumbledCount = operators.filter((o) => o.badges.includes("JUMBLED")).length;

  // Filtered operators
  const filteredOperators = operators.filter((op) => {
    const matchesSearch =
      op.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      op.id.toString().includes(searchTerm);
    const matchesStatus =
      statusFilter === "All Status" || op.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesAccess =
      accessFilter === "All Access Level" ||
      op.accessLevel.toLowerCase() === accessFilter.toLowerCase();
    return matchesSearch && matchesStatus && matchesAccess;
  });

  // Row selection
  const handleToggleSelectAll = (e) => {
    const checked = e.target.checked;
    setOperators((prev) => prev.map((op) => ({ ...op, selected: checked })));
  };

  const handleToggleSelectRow = (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, selected: !op.selected } : op))
    );
  };

  const handleTogglePassword = (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, showPassword: !op.showPassword } : op))
    );
  };

  const handleChangeAccessLevel = (id, newLevel) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, accessLevel: newLevel } : op))
    );
  };

  // Menu action handlers
  const handleGrantAccess = (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: "Active" } : op))
    );
    setActiveMenuId(null);
  };

  const handleDenyAccess = (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: "Denied" } : op))
    );
    setActiveMenuId(null);
  };

  const handleResetPassword = (id) => {
    const generated = "Temp#" + Math.random().toString(36).slice(-6) + "!";
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, password: generated, showPassword: true } : op))
    );
    alert(`Password reset to: ${generated}`);
    setActiveMenuId(null);
  };

  const handleToggleFreeze = (id) => {
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id !== id) return op;
        const isFrozen = op.status === "Frozen" || op.badges.includes("FROZEN");
        const newBadges = isFrozen
          ? op.badges.filter((b) => b !== "FROZEN")
          : [...op.badges, "FROZEN"];
        return {
          ...op,
          status: isFrozen ? "Active" : "Frozen",
          badges: newBadges,
        };
      })
    );
    setActiveMenuId(null);
  };

  const handleToggleJumble = (id) => {
    setOperators((prev) =>
      prev.map((op) => {
        if (op.id !== id) return op;
        const hasJumbled = op.badges.includes("JUMBLED");
        return {
          ...op,
          badges: hasJumbled
            ? op.badges.filter((b) => b !== "JUMBLED")
            : [...op.badges, "JUMBLED"],
        };
      })
    );
    setActiveMenuId(null);
  };

  const handleDeleteOperator = (id) => {
    if (confirm("Are you sure you want to delete this operator?")) {
      setOperators((prev) => prev.filter((op) => op.id !== id));
    }
    setActiveMenuId(null);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Username,AccessLevel,Status,Badges"]
        .concat(
          operators.map(
            (o) =>
              `${o.id},"${o.username}","${o.accessLevel}","${o.status}","${o.badges.join(";")}"`
          )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `operators_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add / Edit submission
  const handleSaveOperator = (e) => {
    e.preventDefault();
    if (editingOperator) {
      setOperators((prev) =>
        prev.map((op) =>
          op.id === editingOperator.id ? { ...op, ...formData } : op
        )
      );
    } else {
      const newId = operators.length > 0 ? Math.max(...operators.map((o) => o.id)) + 1 : 1;
      setOperators((prev) => [
        ...prev,
        {
          id: newId,
          username: formData.username,
          password: formData.password || "Pass#" + Math.random().toString(36).slice(-4),
          showPassword: true,
          accessLevel: formData.accessLevel,
          status: formData.status,
          badges: [],
          accessMessage: "—",
          selected: false,
          totalReports: 0,
          validRecords: 0,
          deletedRecords: 0,
        },
      ]);
    }
    setIsModalOpen(false);
    setEditingOperator(null);
  };

  // Open Details View if selected
  if (selectedOperatorDetails) {
    return (
      <OperatorDetails
        operator={selectedOperatorDetails}
        onBack={() => setSelectedOperatorDetails(null)}
        onUpdateOperator={(updated) => {
          setOperators((prev) =>
            prev.map((op) => (op.id === updated.id ? { ...op, ...updated } : op))
          );
          setSelectedOperatorDetails(updated);
        }}
        onDeleteOperator={(id) => {
          setOperators((prev) => prev.filter((op) => op.id !== id));
          setSelectedOperatorDetails(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans flex flex-col">
      {/* Shared Navbar */}
      <Navbar />

      {/* Main Container bounded within max-w-7xl */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Title & Add Operator CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
              Operator Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage operators, access levels and remote controls.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingOperator(null);
              setFormData({ username: "", password: "", accessLevel: "Telecom", status: "Active" });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Operator
          </button>
        </div>

        {/* 4 Analytics / Metric Cards */}
        <OperatorMetrics
          total={totalCount}
          active={activeCount}
          frozen={frozenCount}
          jumbled={jumbledCount}
        />

        {/* Filter Toolbar */}
        <OperatorToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          accessFilter={accessFilter}
          onAccessFilterChange={setAccessFilter}
          onExport={handleExport}
        />

        {/* Operator Table + Pagination */}
        <div className="space-y-0">
          <OperatorTable
            operators={operators}
            filteredOperators={filteredOperators}
            onToggleSelectAll={handleToggleSelectAll}
            onToggleSelectRow={handleToggleSelectRow}
            onViewDetails={setSelectedOperatorDetails}
            onTogglePassword={handleTogglePassword}
            onChangeAccessLevel={handleChangeAccessLevel}
            onEdit={(op) => {
              setEditingOperator(op);
              setFormData({
                username: op.username,
                password: op.password,
                accessLevel: op.accessLevel,
                status: op.status,
              });
              setIsModalOpen(true);
            }}
            activeMenuId={activeMenuId}
            setActiveMenuId={setActiveMenuId}
            onGrantAccess={handleGrantAccess}
            onDenyAccess={handleDenyAccess}
            onResetPassword={handleResetPassword}
            onToggleFreeze={handleToggleFreeze}
            onToggleJumble={handleToggleJumble}
            onDelete={handleDeleteOperator}
          />
          <OperatorPagination shownCount={filteredOperators.length} totalCount={operators.length} />
        </div>
      </main>

      {/* Add / Edit Operator Modal */}
      <OperatorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingOperator={editingOperator}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSaveOperator}
      />
    </div>
  );
}
