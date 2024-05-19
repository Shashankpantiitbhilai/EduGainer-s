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
import ProtectedRoute from "./Protectedroute.js";
import Navbar from "./Components/Navbar.jsx";

const Main = () => {
    const location = useLocation();
    const hideNavbarPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/otp-verify"];
    const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <Routes>
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
                        <ProtectedRoute>
                            <Library />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/new-reg"
                    element={
                        <ProtectedRoute>
                            <NewReg />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/success/:id"
                    element={
                        <ProtectedRoute>
                            <Success />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default Main;
