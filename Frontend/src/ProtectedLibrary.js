import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const ProtectedLibrary = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);
    if (IsUserLoggedIn?.role === "superAdmin") return children
    // Check if user is logged in
    if (!IsUserLoggedIn || IsUserLoggedIn?.role === "user") {
        return <Navigate to="/login" replace />;
    }

console.log(IsUserLoggedIn,"isuserloggedin")
    // Check if user has library permission
    const hasLibraryPermission = IsUserLoggedIn?.libraryDetails?.libraryAccess === true;


    // Check if user is employee/admin and has library permission
    if (!hasLibraryPermission) {
        return <Navigate to="/admin_home" replace />;
    }

    return children;
};
export default ProtectedLibrary