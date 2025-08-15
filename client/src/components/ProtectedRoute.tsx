import React from "react";
import { isAuthenticated } from "../../utils/auth";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
