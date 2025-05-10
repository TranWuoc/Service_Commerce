import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // State to store admin status

  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(adminStatus);
  }, []); // Only runs once after component mounts

  // While the isAdmin state is not set yet, we can render null or loading state
  if (isAdmin === null) {
    return null; // Or show a loading spinner here
  }

  // Nếu là route adminOnly mà không phải admin → chuyển về dashboard
  if (adminOnly && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};
