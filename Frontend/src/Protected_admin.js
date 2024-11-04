

import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "./App";

const Protected_Admin = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);
<<<<<<< HEAD
 console.log(IsUserLoggedIn,"userloggedin")
=======
 
>>>>>>> 4e4ce2400a03e83535b5ef62b1cbcf7839353dc1
    if (IsUserLoggedIn?.role === "superAdmin") return children
    if (!IsUserLoggedIn || IsUserLoggedIn?.role === "user") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default Protected_Admin;
