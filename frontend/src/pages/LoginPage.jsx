import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FcGoogle } from "react-icons/fc";


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
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
                
                <form noValidate onSubmit={handleSubmit}>
                    {errors?.general && <p className="text-red-500 text-sm mb-4">{errors.general}</p>}
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors?.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                    </div>
                    
                    <button type="submit" className="w-full bg-[#dc6b01] text-white py-2 rounded-md hover:bg-[#b55a01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc6b01]">
                        Login
                    </button>
                    <div className="my-4 text-center">
                        <span className="text-gray-500">or</span>
                    </div>
                    <a 
                        href="http://127.0.0.1:8000/api/auth/google/redirect" 
                        className="w-full flex items-center justify-center bg-white border border-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <FcGoogle size={24} />
                        <span className="ml-2">Sign in with Google</span>
                    </a>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;