import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./Components/Home.jsx";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import OTPVerify from "./Components/Auth/otp-verify.jsx";

import ForgotPassword from "./Components/Auth/forgot-password.jsx";
import ResetPassword from "./Components/Auth/Reset-Password.jsx";
import Library from "./Components/Library/Library.jsx";
import NewReg from "./Components/Library/New-Reg.jsx";
import Success from "./Components/Library/Success.jsx";
import ProtectedUser from "./Protected_user.js";

import ProtectedAdmin from "./Protected_admin.js";
import Navbar from "./Components/Navbar.jsx";
import Dashboard from "./Components/User/dashboard.jsx";
import Profile from "./Components/User/Profile.jsx";
import AdminDashboard from "./Components/Admin/ADMIN_HOME.jsx";
import AdminLibrary from "./Components/Admin/Library/Admin_Library.jsx";
import ManageUsers from "./Components/Admin/Library/ManageUsers.jsx"
import ManageResources from "./Components/Admin/Library/Resources.jsx";
import Resources from "./Components/Resources/resources.jsx"
import EdugainerClasses from "./Components/Classes/classes.jsx";
import ClassesRegistration from "./Components/Classes/new-reg.jsx";

import SuccessClasses from "./Components/Classes/Success.jsx";
import Chat from "./Components/chat/dashboard.jsx"
import AdminChat from "./Components/Admin/chatAdmin/chatAdmin.jsx";
import ManageBooking from "./Components/Admin/Library/monthlyseat/table.jsx";
import Policies from "./Components/policies/Policies.jsx";
import StudentManagementTable from "./Components/Admin/Library/seat/ManageSeats.jsx";
import  Fee from "./Components/Library/fee.jsx"
// import FeePaymentSuccess from "./Components/Library/fee-pay-success.jsx"
const Main = () => {
    const location = useLocation();
    const hideNavbarPaths = ["/login", "/register", "/forgot-password", "/reset-password", "/otp-verify"];
    const shouldHideNavbar = hideNavbarPaths.includes(location.pathname);

    return (
        <>
            {!shouldHideNavbar && <Navbar />}
            <Routes>
                <Route path="/admin_home" element={<AdminDashboard />} />
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />
              
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
                <Route path="/otp-verify/:id" element={<OTPVerify />} />
                <Route path="/chat/home" element={<ProtectedUser><Chat /> </ProtectedUser >} />
                <Route path="/Policies" element={<Policies />} />
                <Route
                    path="/library/fee-pay"
                    element={
                        <ProtectedUser>
                            <Fee />
                        </ProtectedUser>
                    }
                />
                
                  {/* <Route
                    path="/fee-payment-success/:id"
                    element={
                        <ProtectedUser>
                            <FeePaymentSuccess/>
                        </ProtectedUser>
                    }
                /> */}
                
                <Route
                    path="/admin/chat"
                    element={
                        <ProtectedAdmin>
                            <AdminChat />
                        </ProtectedAdmin>
                    }
                />
            
                <Route
                    path="/resources"
                    element={
                        <ProtectedUser>
                            <Resources />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/library"
                    element={
                        <ProtectedUser>
                            <Library />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/classes"
                    element={
                        <ProtectedUser>
                            <EdugainerClasses />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/classes-reg/:id"
                    element={
                        <ProtectedUser>
                            <ClassesRegistration />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/classes/success/:id"
                    element={
                        <ProtectedUser>
                            <SuccessClasses />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/new-reg"
                    element={
                        <ProtectedUser>
                            <NewReg />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/success/:id"
                    element={
                        <ProtectedUser>
                            <Success />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/dashboard/:id"
                    element={
                        <ProtectedUser>
                            <Dashboard />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/profile/:id"
                    element={
                        <ProtectedUser>
                            <Profile />
                        </ProtectedUser>
                    }
                />
                <Route
                    path="/admin_Library"
                    element={
                        <ProtectedAdmin>
                            <AdminLibrary />
                        </ProtectedAdmin>
                    }
                />
                <Route
                    path="/admin_Library/manage-seats"
                    element={
                        <ProtectedAdmin>
                            <ManageBooking />
                        </ProtectedAdmin>
                    }
                />
                <Route
                    path="/admin_library/manage-users"
                    element={
                        <ProtectedAdmin>
                            <ManageUsers />
                        </ProtectedAdmin>
                    }
                />
                <Route
                    path="/admin_library/manage-resources"
                    element={
                        <ProtectedAdmin>
                            <ManageResources />
                        </ProtectedAdmin>
                    }
                />
                <Route
                    path="/admin_library/manage-current-month-bookings"
                    element={
                        <ProtectedAdmin>
                            <StudentManagementTable/>
                        </ProtectedAdmin>
                    }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default Main;
