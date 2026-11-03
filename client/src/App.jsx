import { useState, useEffect } from "react";
import OperatorPortal from "./features/operator/OperatorPortal";
import OperatorManagement from "./features/admin/OperatorManagement";
import OperatorDetails from "./features/admin/OperatorDetails";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import ReportDetailView from "./features/operator/components/ReportDetailView";

export default function App() {
  const [currentPath, setCurrentPath] = useState(
    window.location.pathname.replace(/\/+$/, "") || "/"
  );

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname.replace(/\/+$/, "") || "/");
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path.replace(/\/+$/, "") || "/");
  };

  const path = currentPath.toLowerCase();

  // 1. Report Detail Views (per user specification)
  // /user-medical-report/:id
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

  // /user-telecom-report/:id
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

  // /admin-medical-report/:id
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

  // /admin-telecom-report/:id
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

  // 2. Operator Details view
  // /admin/operator/:id or /operator-details
  const opDetailsMatch = currentPath.match(/^\/admin\/operator\/?(.*)$/i);
  if (opDetailsMatch && opDetailsMatch[1]) {
    const id = opDetailsMatch[1];
    return (
      <OperatorManagement
        initialOperatorId={id}
        onLogout={() => navigate("/login")}
      />
    );
  }

  if (path === "/operator-details") {
    return <OperatorDetails onBack={() => navigate("/admin")} />;
  }

  // 3. Admin Dashboard (Operator Management)
  // /admin or /admin-dashboard
  if (path === "/admin" || path === "/admin-dashboard") {
    return <OperatorManagement onLogout={() => navigate("/login")} />;
  }

  // 4. Auth Views
  // /login
  if (path === "/login") {
    return (
      <Login
        onNavigateToRegister={() => navigate("/register")}
        onLoginSuccess={() => navigate("/operator")}
      />
    );
  }

  // /register
  if (path === "/register") {
    return (
      <Register
        onNavigateToLogin={() => navigate("/login")}
        onRegisterSuccess={() => navigate("/operator")}
      />
    );
  }

  // 5. Operator Portal Views
  // /operator/medical or /medical
  if (path === "/operator/medical" || path === "/medical") {
    return (
      <OperatorPortal
        initialDomain="medical"
        onLogout={() => navigate("/login")}
      />
    );
  }

  // /operator/telecom or /telecom
  if (path === "/operator/telecom" || path === "/telecom") {
    return (
      <OperatorPortal
        initialDomain="telecom"
        onLogout={() => navigate("/login")}
      />
    );
  }

  // /operator, /operator-portal, or / (default)
  return (
    <OperatorPortal
      initialDomain="medical"
      onLogout={() => navigate("/login")}
    />
  );
}
