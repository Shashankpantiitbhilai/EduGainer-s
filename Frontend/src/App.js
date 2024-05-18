import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Dashboard from "./Components/dashboard.jsx";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import OTPVerify from "./Components/Auth/otp-verify.jsx";
import GoogleRegister from "./Components/Auth/GoogleRegister";
import ForgotPassword from "./Components/Auth/forgot-password.jsx";
import ResetPassword from "./Components/Auth/Reset-Password.jsx";
import { fetchCredentials } from "./services/auth";
import Library from "./Components/Library/Library.jsx";
import NewReg from "./Components/Library/New-Reg.jsx";
import Success from "./Components/Library/Success.jsx"
const AdminContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState(null);

    useEffect(() => {
        fetchCredentials().then((User) => {
            if (User) {
                setIsUserLoggedIn(User);
            }
        });
    }, []);

    console.log(IsUserLoggedIn);

    // Routing
    let routes;
    if (IsUserLoggedIn) {
        routes = (
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/library" element={<Library />} />
                <Route path="/new-reg" element={<NewReg />} />
                <Route path="/success" element={<Success />} />
                <Route path="/register/google/:id" element={<GoogleRegister />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/register/google/:id" element={<GoogleRegister />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                <Route path="/otp-verify" element={<OTPVerify />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }
    return (
        <AdminContext.Provider value={{ IsUserLoggedIn, setIsUserLoggedIn }}>
            <BrowserRouter>{routes}</BrowserRouter>
        </AdminContext.Provider>
    );
}

export { AdminContext };
export default App;
