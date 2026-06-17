import { Navigate } from "react-router-dom";

function ProtectedRouteByRole({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) return <Navigate to="/" replace />;
  if (allowedRoles.length && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role || "user"}`} replace />;
  }

  return children;
}

export default ProtectedRouteByRole;
