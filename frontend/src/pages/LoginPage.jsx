import { useState } from "react";
import { useAuth } from "../context/AuthContext";


const LoginPage = () => {
    const { login } = useAuth();
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        const newErrors = {};
        if (!email.trim()) newErrors.email = ['Email is required'];
        if (!password.trim()) newErrors.password = ['Password is required'];

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await login({ email, password});
        }catch (err){
            console.error("Login error:", err);
            console.log("Response data:", err.response?.data);
        
            if (err.response && err.response.status === 422){
                setErrors(err.response.data.errors);
            } else if (err.response && err.response.status === 401) {
                setErrors({ email: ['Invalid credentials'] });
            } else {
                console.error("Unexpected error:", err);
                setErrors({ general: ['An unexpected error occurred. Please try again later.'] });
            }
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form noValidate onSubmit={handleSubmit}>
                {errors?.general && <p style={{ color: 'red' }}>{errors.general}</p>}
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    {errors?.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {errors?.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;