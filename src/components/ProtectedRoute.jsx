import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token'); // Verifica si hay un token almacenado

    return token ? children : <Navigate to="/Login" />; // Redirige a Login si no hay token
};

export default ProtectedRoute;
