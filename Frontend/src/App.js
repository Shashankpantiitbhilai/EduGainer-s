import "./App.css";
import React, { useEffect, useState, createContext } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
// import Home from './Home';
// import AddUser from "./AddUser";

import Dashboard from "./Components/dashboard.jsx";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";

import GoogleRegister from "./Components/Auth/GoogleRegister";
import ForgotPassword from "./Components/Auth/forgot-password.jsx";
import ResetPassword from "./Components/Auth/Reset-Password.jsx";
import { fetchCredentials } from "./services/auth";

const AdminContext = createContext();

function App() {
    const [IsUserLoggedIn, setIsUserLoggedIn] = useState();
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
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="/register/google/:id" element={<GoogleRegister />} />

                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        );
    } else {
        routes = (
            <Routes>
                <Route path="/login" element={<Login />}>

                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/register" element={<Register />}>
                    <Route path="dashboard" element={<Dashboard />} />
                </Route>
                <Route path="/register/google/:id" element={<GoogleRegister />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
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
