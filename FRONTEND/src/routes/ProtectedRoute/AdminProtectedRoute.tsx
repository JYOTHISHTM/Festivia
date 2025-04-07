import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { RootState } from "../../redux/store";

const AdminProtectedRoute: React.FC = () => {
    const isAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
    const [authChecked, setAuthChecked] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setAuthChecked(true);
    }, [isAuthenticated]);

    if (!authChecked) return null;

    return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace state={{ from: location }} />;
};

export default AdminProtectedRoute;
