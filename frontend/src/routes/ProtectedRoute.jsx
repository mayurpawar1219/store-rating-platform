import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";

function ProtectedRoute({ children, allowedRoles }) {
  const { token, role, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Prevent cross-access: route users to their allowed path
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "owner") return <Navigate to="/owner" replace />;
    if (role === "user") return <Navigate to="/user" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;