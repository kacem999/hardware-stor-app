import { useState, useEffect } from 'react';
import apiClient from '../../api/axios';
import Modal from '../../components/Modal'; // Import Modal
import AddProductForm from '../../components/admin/AddProductForm'; // Import Form
import EditProductForm from '../../components/admin/EditProductForm'; // Import Edit Form

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // State for the Edit modal
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/products');
            console.log('Products response:', response.data);
            setProducts(response.data);
        } catch (err) {
            setError('Failed to fetch products');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Initial fetch
    }, []);

    const handleOpenEditModal = (product) => {
        setEditingProduct(product);
        setIsEditModalOpen(true);
    };

    const handleProductAdded = () => {
        setIsModalOpen(false); 
        fetchProducts();
    }

    const handleProductUpdated = () => {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        fetchProducts();
    }

    const handleDeleteProduct = async (productId) => {
        if (!window.confirm('Are you sure you want to delete this product ?')) {
            return ;
        }

        try {
            await apiClient.delete( `/products/${productId}`);
            alert('Product deleted successfully');
            fetchProducts(); // Refresh the product list
        } catch (error) {
            console.error('Failed to delete product:', error);
            alert('An error occurred while deleting the product');
        }
    }

    if (loading) return <div className="text-center p-8">Loading products...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
                <button onClick={() => setIsModalOpen(true)} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                    Add New Product
                </button>
            </div>

            {/* The Modal for adding a new product */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Product">
                <AddProductForm onSuccess={handleProductAdded} />
            </Modal>

            {/* The Modal for Editing a product */}
            {editingProduct && (
                <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Product">
                    <EditProductForm product={editingProduct} onSuccess={handleProductUpdated} />
                </Modal>
            )}


            {/* The rest of the page with the table */}
            {loading ? <p>Loading...</p> : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {product.category?.name || 'No Category'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${product.price}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stock_quantity}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* 5. Hook up the Edit button */}
                                        <button onClick={() => handleOpenEditModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDeleteProduct(product.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManageProductsPage;