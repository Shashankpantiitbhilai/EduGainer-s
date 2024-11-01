

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const ProtectedSuperAdmin = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);
console.log(IsUserLoggedIn)
    if (!IsUserLoggedIn || IsUserLoggedIn?.role !== "superAdmin") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedSuperAdmin;
