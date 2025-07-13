// In frontend/src/components/admin/AdminRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminRoute = () => {
    const { user, token, loading } = useAuth(); // 1. Get the loading state

    // 2. If we are still loading, don't render anything yet
    if (loading) {
        return <div>Loading...</div>; // Or a spinner component
    }

    // 3. Now that loading is false, we can safely check the user and token
    if (!token || user?.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;