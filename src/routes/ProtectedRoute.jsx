import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token =
    role === "ADMIN"
      ? localStorage.getItem("access_token")
      : localStorage.getItem("token");

  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to={`/login/${role.toLowerCase()}`} replace />;
  }

  if (role && userRole && userRole !== role) {
    return <Navigate to={`/login/${role.toLowerCase()}`} replace />;
  }

  return children;
}
