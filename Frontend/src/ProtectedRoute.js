// ProtectedRoute.js
import React,{useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from './App';
// hypothetical Auth Context for role management

const ProtectedRoute = ({ role, children }) => {
    const { IsUserLoggedIn } = useContext(AdminContext);

    if (!IsUserLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // Allow access based on role hierarchy: superadmin > admin > library > user
    const roleHierarchy = {
        superadmin: 3,
        admin: 2,
        library: 1,
        user: 0,
    };

    if (roleHierarchy[IsUserLoggedIn.role] < roleHierarchy[role]) {
        return <Navigate to="/" replace />; // Redirect to home if insufficient permissions
    }

    return children;
};

export default ProtectedRoute;
