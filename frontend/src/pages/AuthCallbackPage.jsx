import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthCallbackPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useAuth(); // We will create this function next

    useEffect(() => {
        const token = searchParams.get('token');

        if (token) {
            loginWithToken(token);
            navigate('/products');
        } else {
            // Handle error case
            navigate('/login?error=social_login_failed');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p>Logging you in...</p>
        </div>
    );
};

export default AuthCallbackPage;