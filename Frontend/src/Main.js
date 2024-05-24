import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import OTPVerify from "./Components/Auth/otp-verify.jsx";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import ForgotPassword from "./Components/Auth/forgot-password.jsx";
import ResetPassword from "./Components/Auth/Reset-Password.jsx";
import Library from "./Components/Library/Library.jsx";
import NewReg from "./Components/Library/New-Reg.jsx";
import Success from "./Components/Library/Success.jsx";
import Protected_User from "./Protected_user.js";

import Protected_Admin from "./Protected_admin.js";
import Navbar from "./Components/Navbar.jsx";
import Dashboard from "./Components/User/dashboard.jsx";
import Profile from "./Components/User/Profile.jsx";
import ADMIN_DASHBOARD from "./Components/Admin/ADMIN_HOME.jsx";
const Main = () => {
    const location = useLocation();
    const hideNavbarPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/otp-verify"];
    const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <Routes>
                <Route path="/admin_home" element={<ADMIN_DASHBOARD />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/google/:id" element={<GoogleRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                <Route path="/otp-verify" element={<OTPVerify />} />
                <Route
                    path="/library"
                    element={
                        <Protected_User>
                            <Library />
                        </Protected_User>
                    }
                />
                <Route
                    path="/new-reg"
                    element={
                        <Protected_User>
                            <NewReg />
                        </Protected_User>
                    }
                />
                <Route
                    path="/success/:id"
                    element={
                        <Protected_User>
                            <Success />
                        </Protected_User>
                    }
                />
                <Route
                    path="/dashboard/:id"
                    element={
                        <Protected_User>
                            <Dashboard />
                        </Protected_User>
                    }
                />
                <Route
                    path="/profile/:id"
                    element={
                        <Protected_User>
                        <Profile />
</Protected_User>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default Main;
