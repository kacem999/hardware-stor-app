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
        <div>
            <h2>Register for an Account</h2>
            <form noValidate onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />

                    {/* Display validation error if it exists  */}
                    {errors.name && <p style={{ color: 'red' }}>{errors.name[0]}</p>}
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
                    {/* Display validation error if it exists  */}
                    {errors.email && <p style={{ color: 'red' }}>{errors.email[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password">Password:</label>
                    <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
                    {/* Display validation error if it exists  */}
                    {errors.password && <p style={{ color: 'red' }}>{errors.password[0]}</p>}
                </div>
                <div>
                    <label htmlFor="password_confirmation">Confirm Password:</label>
                    <input type="password" id="password_confirmation" name="password_confirmation" value={formData.password_confirmation} onChange={handleChange} required />
                    {/* Display validation error if it exists  */}
                    {errors.password_confirmation && <p style={{ color: 'red' }}>{errors.password_confirmation[0]}</p>}
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterPage;