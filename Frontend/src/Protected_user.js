import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const ProtectedRoute = ({ children }) => {
  const { IsUserLoggedIn } = useContext(AdminContext);

  // console.log(IsUserLoggedIn)
  if (!IsUserLoggedIn) {
    return <Navigate to="/" replace />;
  }



  return children;
};

export default ProtectedRoute;
