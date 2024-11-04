

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const Protected_Admin = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);



    if (IsUserLoggedIn?.role === "superAdmin") return children
    if (!IsUserLoggedIn || IsUserLoggedIn?.role === "user") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected_Admin;
