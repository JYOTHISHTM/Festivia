import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../../redux/store";

const CreatorProtectedRoute: React.FC = () => {
  const isAuthenticated = useSelector((state: RootState) => state.creatorAuth.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to="/creator/login" replace />;
};

export default CreatorProtectedRoute;
