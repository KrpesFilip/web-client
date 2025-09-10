import React from 'react';
import { Navigate } from 'react-router-dom';
import { useGlobalContext } from '../context/global';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useGlobalContext();

  if (!user) {
    // Not logged in, redirect to homepage
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not admin
    return <Navigate to="/" replace />;
  }

  // User is allowed
  return children;
};

export default ProtectedRoute;
