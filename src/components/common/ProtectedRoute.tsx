import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles: string[];
  isAuthenticated: boolean;
}

export default function ProtectedRoute({
  children,
  allowedRoles,
  isAuthenticated,
}: ProtectedRouteProps) {
  const userRole = localStorage.getItem("user_role");

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  if (userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
