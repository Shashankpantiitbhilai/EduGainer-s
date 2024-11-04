import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AdminContext } from "../App";
import { LibraryAccessDialog } from "../Components/Admin/Library/access";

const ProtectedLibrary = ({ children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);
    const [isDialogOpen, setDialogOpen] = useState(false);

    const hasLibraryPermission = IsUserLoggedIn?.currentUser?.permissions.includes("library");
    const isEmployee = IsUserLoggedIn?.role === "employee";
    const isSuperAdmin = IsUserLoggedIn?.role === "superAdmin";

    useEffect(() => {
        if (!hasLibraryPermission ) {
            setDialogOpen(true);
        } else {
            setDialogOpen(false);
        }
    }, [hasLibraryPermission, isEmployee]);

    // Handle dialog success
    const handleDialogSuccess = () => {
        setDialogOpen(false);
        // Additional permission update logic if needed
    };

    // Early returns after hooks
    if (isSuperAdmin) return children;

    if (!IsUserLoggedIn || IsUserLoggedIn?.role === "user") {
        return <Navigate to="/login" replace />;
    }

    // If has permission, return children directly without dialog
    if (hasLibraryPermission && isEmployee) {
        return children;
    }

    return (
        <>
            {isDialogOpen && (
                <LibraryAccessDialog
                    open={isDialogOpen}
                    onSuccess={handleDialogSuccess}
                    onClose={() => setDialogOpen(false)}
                    isUserLoggedIn={IsUserLoggedIn}
                />
            )}
            {!isDialogOpen && hasLibraryPermission && children}
        </>
    );
};

export default ProtectedLibrary;