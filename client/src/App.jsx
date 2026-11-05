import { useState, useEffect } from "react";
import LandingPage from "./features/landing/LandingPage";
import OperatorPortal from "./features/operator/OperatorPortal";
import OperatorManagement from "./features/admin/OperatorManagement";
import OperatorDetails from "./features/admin/OperatorDetails";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import ReportDetailView from "./features/operator/components/ReportDetailView";
import AccessDenied from "./components/AccessDenied";

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.replace(/\/+$/, "") || "/"
  );

  // Authenticated user state from localStorage
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.replace(/\/+$/, "") || "/");
    };

    const handleStorageChange = () => {
      try {
        const u = localStorage.getItem("authUser");
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("popstate", handlePopState);
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path.replace(/\/+$/, "") || "/");
  };

  const path = currentPath.toLowerCase();

  const handleLoginSuccess = (user) => {
    localStorage.setItem("operator_session_start_time", String(Date.now()));
    localStorage.setItem("operator_session_is_paused", "false");
    localStorage.removeItem("operator_session_paused_time");
    localStorage.setItem("operator_session_accumulated_paused_ms", "0");
    setCurrentUser(user);
    if (user?.role === "admin") {
      navigate("/admin");
    } else if (user?.accessLevel === "Medical") {
      navigate("/operator/medical");
    } else {
      navigate("/operator/telecom");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
    localStorage.removeItem("operator_session_start_time");
    localStorage.removeItem("operator_session_is_paused");
    localStorage.removeItem("operator_session_paused_time");
    localStorage.removeItem("operator_session_accumulated_paused_ms");
    sessionStorage.clear();
    setCurrentUser(null);
    navigate("/");
  };

  const isAuthenticated = !!currentUser;
  const isAdmin = currentUser?.role === "admin";
  const isOperator = currentUser?.role === "operator";

  // ==========================================
  // 1. PUBLIC ROUTES
  // ==========================================

  // Default Homepage: Landing Page
  if (path === "" || path === "/") {
    return (
      <LandingPage
        currentUser={currentUser}
        onNavigate={navigate}
        onLogout={handleLogout}
      />
    );
  }

  // Login Page
  if (path === "/login") {
    // If already logged in, redirect user to their respective portal UI
    if (isAuthenticated) {
      if (isAdmin) {
        navigate("/admin");
      } else if (currentUser?.accessLevel === "Medical") {
        navigate("/operator/medical");
      } else {
        navigate("/operator/telecom");
      }
      return null;
    }

    return (
      <Login
        onNavigateToRegister={() => navigate("/register")}
        onLoginSuccess={handleLoginSuccess}
        onNavigateHome={() => navigate("/")}
      />
    );
  }

  // Register Page
  if (path === "/register" || path === "/sign-up") {
    return (
      <Register
        onNavigateToLogin={() => navigate("/login")}
        onRegisterSuccess={() => navigate("/login")}
        onNavigateHome={() => navigate("/")}
      />
    );
  }

  // ==========================================
  // 2. ADMIN-ONLY ROUTES (Protected & Isolated)
  // ==========================================
  const isAdminRoute =
    path === "/admin" ||
    path === "/admin-dashboard" ||
    path === "/operator-details" ||
    path.startsWith("/admin/") ||
    path.startsWith("/admin-medical-report") ||
    path.startsWith("/admin-telecom-report");

  if (isAdminRoute) {
    // 2.1 Not logged in -> Redirect to login
    if (!isAuthenticated) {
      navigate("/login");
      return null;
    }

    // 2.2 Operator attempting to access Admin UI -> BLOCK & SHOW ACCESS DENIED
    if (isOperator) {
      return (
        <AccessDenied
          currentUser={currentUser}
          targetRole="admin"
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );
    }

    // 2.3 Admin Report Views
    const adminMedMatch = currentPath.match(/^\/admin-medical-report\/?(.*)$/i);
    if (adminMedMatch) {
      const id = adminMedMatch[1] || "00000843843";
      return (
        <ReportDetailView
          reportId={id}
          level="medical"
          isAdmin={true}
          onBack={() => navigate("/admin")}
        />
      );
    }

    const adminTelMatch = currentPath.match(/^\/admin-telecom-report\/?(.*)$/i);
    if (adminTelMatch) {
      const id = adminTelMatch[1] || "001";
      return (
        <ReportDetailView
          reportId={id}
          level="telecom"
          isAdmin={true}
          onBack={() => navigate("/admin")}
        />
      );
    }

    // 2.4 Operator Details view
    const opDetailsMatch = currentPath.match(/^\/admin\/operator\/?(.*)$/i);
    if (opDetailsMatch && opDetailsMatch[1]) {
      const id = opDetailsMatch[1];
      return (
        <OperatorManagement
          initialOperatorId={id}
          onLogout={handleLogout}
        />
      );
    }

    if (path === "/operator-details") {
      return <OperatorDetails onBack={() => navigate("/admin")} />;
    }

    // 2.5 Admin Main Dashboard
    return <OperatorManagement onLogout={handleLogout} />;
  }

  // ==========================================
  // 3. OPERATOR-ONLY ROUTES (Protected & Isolated)
  // ==========================================
  const isOperatorRoute =
    path === "/operator" ||
    path === "/operator-portal" ||
    path === "/medical" ||
    path === "/telecom" ||
    path.startsWith("/operator/") ||
    path.startsWith("/user-medical-report") ||
    path.startsWith("/user-telecom-report");

  if (isOperatorRoute) {
    // 3.1 Not logged in -> Redirect to login
    if (!isAuthenticated) {
      navigate("/login");
      return null;
    }

    // 3.2 Admin attempting to access Operator UI -> BLOCK & SHOW ACCESS DENIED
    if (isAdmin) {
      return (
        <AccessDenied
          currentUser={currentUser}
          targetRole="operator"
          onNavigate={navigate}
          onLogout={handleLogout}
        />
      );
    }

    // 3.3 User Report Detail Views
    const userMedMatch = currentPath.match(/^\/user-medical-report\/?(.*)$/i);
    if (userMedMatch) {
      const id = userMedMatch[1] || "00000843843";
      return (
        <ReportDetailView
          reportId={id}
          level="medical"
          isAdmin={false}
          onBack={() => navigate("/operator/medical")}
        />
      );
    }

    const userTelMatch = currentPath.match(/^\/user-telecom-report\/?(.*)$/i);
    if (userTelMatch) {
      const id = userTelMatch[1] || "001";
      return (
        <ReportDetailView
          reportId={id}
          level="telecom"
          isAdmin={false}
          onBack={() => navigate("/operator/telecom")}
        />
      );
    }

    // 3.4 Operator Portal Views
    if (path === "/operator/telecom" || path === "/telecom") {
      return (
        <OperatorPortal
          initialDomain="telecom"
          onLogout={handleLogout}
        />
      );
    }

    // /operator/medical, /medical, or /operator default
    return (
      <OperatorPortal
        initialDomain={currentUser?.accessLevel === "Telecom" ? "telecom" : "medical"}
        onLogout={handleLogout}
      />
    );
  }

  // ==========================================
  // 4. FALLBACK (Unknown routes -> Landing Page)
  // ==========================================
  return (
    <LandingPage
      currentUser={currentUser}
      onNavigate={navigate}
      onLogout={handleLogout}
    />
  );
}
