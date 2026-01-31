import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const isAuthenticated = localStorage.getItem('cc-app-token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/approver/login" />
};

export default ProtectedRoute