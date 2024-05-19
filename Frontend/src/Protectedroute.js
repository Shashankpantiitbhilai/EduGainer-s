import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const ProtectedRoute = ({ children }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  if (!IsUserLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
