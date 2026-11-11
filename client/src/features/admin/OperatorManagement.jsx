import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config/api";
import Navbar from "../../components/Navbar";
import OperatorMetrics from "./components/OperatorMetrics";
import OperatorToolbar from "./components/OperatorToolbar";
import OperatorTable from "./components/OperatorTable";
import OperatorPagination from "./components/OperatorPagination";
import OperatorModal from "./components/OperatorModal";
import OperatorDetails from "./OperatorDetails";
import MasterKeyModal from "./components/MasterKeyModal";
import { Plus, KeyRound } from "lucide-react";

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
      accessLevel: "Medical",
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
      accessLevel: "Telecom",
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

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMasterKeyModalOpen, setIsMasterKeyModalOpen] = useState(false);
  const [editingOperator, setEditingOperator] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    accessLevel: "Telecom",
    status: "Active",
  });

  const [isLiveConnected, setIsLiveConnected] = useState(false);

  // Safely normalize incoming operator objects
  const normalizeOperators = (list, prevList = []) => {
    if (!Array.isArray(list)) return [];
    const prevMap = new Map();
    if (Array.isArray(prevList)) {
      prevList.forEach((op) => {
        if (op && op.id) prevMap.set(op.id, op);
      });
    }

    return list.map((op) => {
      const prev = prevMap.get(op.id);
      return {
        ...op,
        selected: prev ? Boolean(prev.selected) : Boolean(op.selected),
        showPassword: prev ? Boolean(prev.showPassword) : Boolean(op.showPassword),
        accessLevel: op.accessLevel === "Telecom" ? "Telecom" : "Medical",
        email: op.email || `${op.username || "operator"}@gmail.com`,
        password: op.password || "",
        badges: Array.isArray(op.badges)
          ? op.badges
          : typeof op.badges === "string"
            ? (() => {
              try {
                const parsed = JSON.parse(op.badges);
                return Array.isArray(parsed) ? parsed : [];
              } catch {
                return [];
              }
            })()
            : [],
      };
    });
  };

  // Fetch operators from backend API
  const fetchOperators = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/operators`);
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setOperators((prev) => normalizeOperators(data.data, prev));
      }
    } catch (err) {
      console.warn("Backend not available, using existing state:", err);
    }
  };

  useEffect(() => {
    // 1. Initial REST fetch
    fetchOperators();

    // 2. Real-time Server-Sent Events (SSE) Stream
    let eventSource;
    try {
      eventSource = new EventSource(`${API_BASE_URL}/api/admin/operators/stream`);

      eventSource.onopen = () => {
        setIsLiveConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && Array.isArray(payload.operators)) {
            setOperators((prev) => normalizeOperators(payload.operators, prev));
            setIsLiveConnected(true);
          }
        } catch (err) {
          console.error("SSE parsing error:", err);
        }
      };

      eventSource.onerror = () => {
        setIsLiveConnected(false);
      };
    } catch (e) {
      console.warn("EventSource error:", e);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
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
    (o) => o.status === "Frozen" || (Array.isArray(o.badges) && o.badges.includes("FROZEN"))
  ).length;
  const jumbledCount = operators.filter(
    (o) => Array.isArray(o.badges) && o.badges.includes("JUMBLED")
  ).length;

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

  const handleChangeAccessLevel = async (id, newLevel) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, accessLevel: newLevel } : op))
    );
    try {
      await fetch(`${API_BASE_URL}/api/admin/operators/${id}/access-level`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessLevel: newLevel }),
      });
    } catch (err) {
      console.warn("Failed to update access level on server:", err);
    }
  };

  // Menu action handlers
  const handleGrantAccess = async (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: "Active", deniedAccess: "No" } : op))
    );
    setActiveMenuId(null);
    try {
      await fetch(`${API_BASE_URL}/api/admin/operators/${id}/grant-access`, {
        method: "POST",
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDenyAccess = async (id) => {
    setOperators((prev) =>
      prev.map((op) => (op.id === id ? { ...op, status: "Denied", deniedAccess: "Yes" } : op))
    );
    setActiveMenuId(null);
    try {
      await fetch(`${API_BASE_URL}/api/admin/operators/${id}/deny-access`, {
        method: "POST",
      });
    } catch (err) {
      console.warn(err);
    }
  };

  const handleResetPassword = async (id) => {
    const targetOp = operators.find((op) => op.id === id);
    const suggestedPass = "Pass#" + Math.random().toString(36).slice(-6) + "!";
    const newPassword = prompt(
      `Set / Give password for ${targetOp?.username || "Operator"}:`,
      suggestedPass
    );

    if (!newPassword || !newPassword.trim()) {
      setActiveMenuId(null);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/operators/${id}/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword.trim() }),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update password");

      setOperators((prev) =>
        prev.map((op) =>
          op.id === id
            ? {
              ...op,
              password: newPassword.trim(),
              showPassword: true,
              status: op.status === "Pending" ? "Active" : op.status,
            }
            : op
        )
      );

      alert(data.message || `Password assigned successfully: ${newPassword.trim()}`);
    } catch (err) {
      alert("Error setting password: " + err.message);
    }
    setActiveMenuId(null);
  };

  const handleToggleFreeze = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/operators/${id}/toggle-freeze`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setOperators((prev) =>
          prev.map((op) =>
            op.id === id ? { ...op, status: data.status, badges: data.badges } : op
          )
        );
      }
    } catch (err) {
      console.warn(err);
    }
    setActiveMenuId(null);
  };

  const handleToggleJumble = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/operators/${id}/toggle-jumble`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setOperators((prev) =>
          prev.map((op) => (op.id === id ? { ...op, badges: data.badges } : op))
        );
      }
    } catch (err) {
      console.warn(err);
    }
    setActiveMenuId(null);
  };

  const handleDeleteOperator = async (id) => {
    if (confirm("Are you sure you want to delete this operator?")) {
      setOperators((prev) => prev.filter((op) => op.id !== id));
      try {
        await fetch(`${API_BASE_URL}/api/admin/operators/${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn(err);
      }
    }
    setActiveMenuId(null);
  };

  const handleExport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Username,Email,AccessLevel,Status,Badges"]
        .concat(
          operators.map(
            (o) =>
              `${o.id},"${o.username}","${o.email || ""}","${o.accessLevel}","${o.status}","${(o.badges || []).join(";")}"`
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
  const handleSaveOperator = async (e) => {
    e.preventDefault();
    try {
      if (editingOperator) {
        if (formData.password) {
          await fetch(`${API_BASE_URL}/api/admin/operators/${editingOperator.id}/password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: formData.password }),
          });
        }
        if (formData.accessLevel) {
          await fetch(`${API_BASE_URL}/api/admin/operators/${editingOperator.id}/access-level`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessLevel: formData.accessLevel }),
          });
        }
        setOperators((prev) =>
          prev.map((op) =>
            op.id === editingOperator.id ? { ...op, ...formData } : op
          )
        );
      } else {
        const res = await fetch(`${API_BASE_URL}/api/admin/operators`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            accessLevel: formData.accessLevel,
            status: formData.status,
          }),
        });
        const data = await res.json();
        if (data.success) {
          fetchOperators();
        } else {
          alert(data.message || "Failed to create operator");
        }
      }
    } catch (err) {
      console.warn("Save operator failed:", err);
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
        onLogout={onLogout}
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
      {/* Shared Navbar with Logout */}
      <Navbar onLogout={onLogout} />

      {/* Main Container bounded within max-w-7xl */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
        {/* Title & Add Operator CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
                Operator Management
              </h1>
              <div
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${isLiveConnected
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-amber-50 border-amber-200 text-amber-700"
                  }`}
                title={isLiveConnected ? "Real-time sync active" : "Connecting to real-time sync"}
              >
                <span
                  className={`w-2 h-2 rounded-full ${isLiveConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    }`}
                ></span>
                <span>{isLiveConnected ? "Live Realtime" : "Syncing..."}</span>
              </div>
            </div>
            <p className="text-xs m text-slate-500 mt-1">
              Manage operators, access levels and remote controls.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={() => setIsMasterKeyModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
              title="Manage Master Decryption Password and Key Vault"
            >
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <span>Master Decryption Key</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEditingOperator(null);
                setFormData({
                  username: "",
                  email: "",
                  password: "",
                  accessLevel: "Telecom",
                  status: "Active",
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 bg-[#0e6b38] hover:bg-[#0b542c] active:scale-[0.98] text-white text-xs font-semibold px-4 py-2.5 rounded-xl shadow-xs transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Operator
            </button>
          </div>
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
                username: op.username || "",
                email: op.email || `${op.username || "operator"}@gmail.com`,
                password: op.password || "",
                accessLevel: op.accessLevel || "Telecom",
                status: op.status || "Active",
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

      {/* Master Decryption Password & Key Vault Modal */}
      <MasterKeyModal
        isOpen={isMasterKeyModalOpen}
        onClose={() => setIsMasterKeyModalOpen(false)}
      />
    </div>
  );
}
