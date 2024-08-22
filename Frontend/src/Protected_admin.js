

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const Protected_Admin = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);

    if (!IsUserLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    else if (IsUserLoggedIn.role === "user") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected_Admin;
