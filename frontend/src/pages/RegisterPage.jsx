import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formData , setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors on a new submission

        // Basic client-side validation
        const newErrors = {};
        if (!formData.name) newErrors.name = ['Name is required'];
        if (!formData.email) newErrors.email = ['Email is required'];
        if (!formData.password) newErrors.password = ['Password is required'];
        if (!formData.password_confirmation) newErrors.password_confirmation = ['Password confirmation is required'];
        
        // If there are client-side errors, show them and stop submission
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            await apiClient.post('/register', formData);
            alert('Registration successful! Please log in.');
            navigate('/login');
        } catch (err) {
            console.error("Error response:", err.response);
            
            // More comprehensive error checking
            if (err.response) {
                // The server responded with an error status
                if (err.response.status === 422) {
                    // Laravel validation errors can be in err.response.data.errors 
                    // OR sometimes directly in err.response.data
                    const validationErrors = err.response.data.errors || err.response.data;
                    setErrors(validationErrors);
                } else {
                    // Handle other HTTP error status codes
                    alert(`Error: ${err.response.status} - ${err.response.statusText}`);
                }
            } else if (err.request) {
                // The request was made but no response was received
                alert('No response received from server. Please check your connection.');
            } else {
                // Something happened in setting up the request
                alert('An error occurred while setting up the request.');
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Register for an Account</h2>
                
                <form noValidate onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
                    </div>
                    
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
                    </div>
                    
                    <div className="mb-6">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <input
                            type="password"
                            id="password_confirmation"
                            name="password_confirmation"
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        {errors.password_confirmation && <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>}
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;