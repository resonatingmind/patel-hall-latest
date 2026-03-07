import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Simple role check: exact match or implicit hierarchy handled in AuthContext or here
    // For now, let's strictly check if a role is required
    if (requiredRole && role !== requiredRole) {
        // If user is Council but tries to access Warder page -> Redirect
        // If user is Member but tries to access Council page -> Redirect
        
        // Allow Council/Warder to access Member pages (implied) if we want, 
        // but for specific portals we might want strict separation.
        // Let's assume strict separation for the dedicated portals as per previous task.
        
        // However, for generic protected routes, we might just want "any auth".
        
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
