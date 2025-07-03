import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';   


const ProtectedRoute = ({ children }) => {
    const { token } = useAuth();

    if(!token) {
        // if no token, redirect to login page 
        return <Navigate to="/login" replace />;
    }

    // if token exists, render the component that was passed as a child
    return children; 
}

export default ProtectedRoute; 