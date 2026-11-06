import { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import LandingPage from "./features/landing/LandingPage";
import OperatorPortal from "./features/operator/OperatorPortal";
import OperatorManagement from "./features/admin/OperatorManagement";
import OperatorDetails from "./features/admin/OperatorDetails";
import Register from "./features/auth/Register";
import Login from "./features/auth/Login";
import ReportDetailView from "./features/operator/components/ReportDetailView";
import AccessDenied from "./components/AccessDenied";

function AdminReportWrapper({ level }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ReportDetailView
      reportId={id || (level === "medical" ? "00000843843" : "001")}
      level={level}
      isAdmin={true}
      onBack={() => navigate("/admin")}
    />
  );
}

function UserReportWrapper({ level }) {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <ReportDetailView
      reportId={id || (level === "medical" ? "00000843843" : "001")}
      level={level}
      isAdmin={false}
      onBack={() =>
        navigate(level === "medical" ? "/operator/medical" : "/operator/telecom")
      }
    />
  );
}

function AdminOperatorParamWrapper({ onLogout }) {
  const { id } = useParams();
  return <OperatorManagement initialOperatorId={id} onLogout={onLogout} />;
}

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem("authUser");
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const u = localStorage.getItem("authUser");
        setCurrentUser(u ? JSON.parse(u) : null);
      } catch {
        setCurrentUser(null);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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

  return (
    <Routes>
      <Route
        path="/"
        element={
          <LandingPage
            currentUser={currentUser}
            onNavigate={(p) => navigate(p)}
            onLogout={handleLogout}
          />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate
              to={
                isAdmin
                  ? "/admin"
                  : currentUser?.accessLevel === "Medical"
                    ? "/operator/medical"
                    : "/operator/telecom"
              }
              replace
            />
          ) : (
            <Login
              onNavigateToRegister={() => navigate("/register")}
              onLoginSuccess={handleLoginSuccess}
              onNavigateHome={() => navigate("/")}
            />
          )
        }
      />

      <Route
        path="/register"
        element={
          <Register
            onNavigateToLogin={() => navigate("/login")}
            onRegisterSuccess={() => navigate("/login")}
            onNavigateHome={() => navigate("/")}
          />
        }
      />
      <Route
        path="/sign-up"
        element={<Navigate to="/register" replace />}
      />

      <Route
        path="/admin"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isOperator ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="admin"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <OperatorManagement onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/admin-dashboard"
        element={<Navigate to="/admin" replace />}
      />

      <Route
        path="/admin/operator/:id"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isOperator ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="admin"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <AdminOperatorParamWrapper onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/operator-details"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isOperator ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="admin"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <OperatorDetails onBack={() => navigate("/admin")} />
          )
        }
      />

      <Route
        path="/admin-medical-report/:id?"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isOperator ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="admin"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <AdminReportWrapper level="medical" />
          )
        }
      />

      <Route
        path="/admin-telecom-report/:id?"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isOperator ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="admin"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <AdminReportWrapper level="telecom" />
          )
        }
      />

      <Route
        path="/operator"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="operator"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <OperatorPortal
              initialDomain={
                currentUser?.accessLevel === "Telecom" ? "telecom" : "medical"
              }
              onLogout={handleLogout}
            />
          )
        }
      />

      <Route
        path="/operator-portal"
        element={<Navigate to="/operator" replace />}
      />

      <Route
        path="/operator/medical"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="operator"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <OperatorPortal initialDomain="medical" onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/medical"
        element={<Navigate to="/operator/medical" replace />}
      />

      <Route
        path="/operator/telecom"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="operator"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <OperatorPortal initialDomain="telecom" onLogout={handleLogout} />
          )
        }
      />

      <Route
        path="/telecom"
        element={<Navigate to="/operator/telecom" replace />}
      />

      <Route
        path="/user-medical-report/:id?"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="operator"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <UserReportWrapper level="medical" />
          )
        }
      />

      <Route
        path="/user-telecom-report/:id?"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" replace />
          ) : isAdmin ? (
            <AccessDenied
              currentUser={currentUser}
              targetRole="operator"
              onNavigate={(p) => navigate(p)}
              onLogout={handleLogout}
            />
          ) : (
            <UserReportWrapper level="telecom" />
          )
        }
      />

      {/* ========================================================= */}
      {/* 4. FALLBACK (Unknown routes -> Landing Page)              */}
      {/* ========================================================= */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
