// src/components/ProtectedRoute.jsx

import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../../custom-components/Spinner";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector((state) => state.user);

  if (loading) {
    return <Spinner />; // or a spinner component
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
