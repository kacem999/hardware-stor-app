import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal';


const ManageCategoriesPage = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState(''); // State for new category name

    // State for modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [formErrors, setFormErrors] = useState({});

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data);

        } catch (error) {
            setError('Failed to fetch categories');
        }finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    // --- Handlers ---

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        try {
            await apiClient.post('/categories', { name: newCategoryName });
            setIsEditModalOpen(false);
            setEditingCategory(null);
            setNewCategoryName('');
            fetchCategories();

        } catch (err) {
            if (err.response && err.response.status === 422) {
                setFormErrors(err.response.data.errors);
            } else {
                alert('Failed to add category');
            }
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        setFormErrors({});
        try {
            await apiClient.put(`/categories/${editingCategory.id}`, { name: editingCategory.name });
            setIsEditModalOpen(false);
            setEditingCategory(null);
            fetchCategories(); // Refresh list
        } catch (err) {
            if (err.response?.status === 422) setFormErrors(err.response.data.errors);
            else alert('An error occurred.');
        }
    };

    const handleDelete = async (categoryId) => {
        if (window.confirm('Are you sure you want to delete this category? All products within it will also be deleted.')) {
            try {
                await apiClient.delete(`/categories/${categoryId}`);
                fetchCategories(); // Refresh list
            } catch (err) {
                alert('Failed to delete category.');
            }
        }
    };

    const openEditModal = (category) => {
        setEditingCategory({ ...category }); // Create a copy to avoid direct state mutation
        setIsEditModalOpen(true);
    }

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Categories</h1>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Add New Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-white shadow-md rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    {/* ... table head ... */}
                    <tbody>
                        {categories.map(category => (
                            <tr key={category.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{category.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{category.slug}</td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button onClick={() => openEditModal(category)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                    <button onClick={() => handleDelete(category.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Category Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Category">
                <form onSubmit={handleAddSubmit}>
                    <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} className="w-full p-2 border rounded" placeholder="Category Name" />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                    <button type="submit" className="mt-4 bg-blue-600 text-white py-2 px-4 rounded">Add</button>
                </form>
            </Modal>

            {/* Edit Category Modal */}
            {editingCategory && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Category">
                    <form onSubmit={handleEditSubmit}>
                        <input type="text" value={editingCategory.name} onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})} className="w-full p-2 border rounded" />
                        {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name[0]}</p>}
                        <button type="submit" className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded">Update</button>
                    </form>
                </Modal>
            )}
        </div>
    );
    
};

export default ManageCategoriesPage;