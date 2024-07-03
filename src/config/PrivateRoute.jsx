import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = sessionStorage.getItem('token');

    if (!token) {
        // Redirect to login page if no token
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default PrivateRoute;

