import { useState, useEffect, use} from 'react';
import apiClient from '../../api/axios';



const AddProductForm = ({ onSuccess }) => {
    const [categories, setCategories] = useState([]); 
    const [formData, setFormData] = useState({
        name: '',
        description: '', 
        price: '',
        stock_quantity: '',
        category_id: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        apiClient.get('/categories').then(response => {
            setCategories(response.data);
        });
    }, []);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        try {
            await apiClient.post('/products', formData);
            alert ('Product added successfully!');
            onSuccess(); // Call the success callback passed via props

        } catch(err){
            if(err.response && err.response.status === 422) {
                setErrors(err.response.data.errors);

            }else{
                console.error(err);
                alert('An error occurred.');

            }
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
                {/* Product Name */}
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
                    <input 
                        type="text" 
                        name="name" 
                        id="name" 
                        value={formData.name}
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name[0]}</p>}
                </div>
                
                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea 
                        name="description" 
                        id="description" 
                        rows="3"
                        value={formData.description}
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description[0]}</p>}
                </div>
                
                {/* Price */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
                    <input 
                        type="number" 
                        name="price" 
                        id="price" 
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price[0]}</p>}
                </div>
                
                {/* Stock Quantity */}
                <div>
                    <label htmlFor="stock_quantity" className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                    <input 
                        type="number" 
                        name="stock_quantity" 
                        id="stock_quantity" 
                        min="0"
                        value={formData.stock_quantity}
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    />
                    {errors.stock_quantity && <p className="text-red-500 text-xs mt-1">{errors.stock_quantity[0]}</p>}
                </div>
                
                {/* Category Select Dropdown */}
                <div>
                    <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
                    <select 
                        name="category_id" 
                        id="category_id" 
                        value={formData.category_id}
                        onChange={handleChange} 
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                    {errors.category_id && <p className="text-red-500 text-xs mt-1">{errors.category_id[0]}</p>}
                </div>

                <div className="flex justify-end">
                    <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                        Add Product
                    </button>
                </div>
            </div>
        </form>
    );
}

export default AddProductForm;