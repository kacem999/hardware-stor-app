import { useState, useEffect, use } from "react";
import apiClient from "../api/axios";
import ProductCard from "../components/ProductCard"; // 1. Import the new component

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);

    // State for our filters
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await apiClient.get('/categories');
                setCategories(response.data);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
                // Continue with empty categories rather than breaking the page
                setCategories([]);
            }
        };
        
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null); // Clear any previous errors
            
            try {
                // Server-side filtering should now work correctly
                const params = new URLSearchParams();
                if (searchTerm) params.append('search', searchTerm);
                if (selectedCategory) params.append('category', selectedCategory);
                
                const response = await apiClient.get(`/products?${params.toString()}`);
                setProducts(response.data);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to fetch products. Please try again later.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        const debounceTimeout = setTimeout(() => {
            fetchProducts();
        }, 300);

        return () => clearTimeout(debounceTimeout);
    }, [searchTerm, selectedCategory]);

    return (
        <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">All Products</h2>
                
                {/* Error notification banner */}
                {error && (
                    <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Filter Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search by name or description..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="md:col-span-2 w-full p-2 border border-gray-300 rounded-md"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`w-full p-2 border rounded-md ${categories.length === 0 ? 'border-yellow-300 bg-yellow-50' : 'border-gray-300'}`}
                        disabled={categories.length === 0}
                    >
                        <option value="">
                            {categories.length === 0 ? 'Categories unavailable' : 'All Categories'}
                        </option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Product Grid */}
                {loading ? (
                    <div className="text-center">Loading...</div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-lg text-gray-600">
                            {selectedCategory 
                                ? "No products found in this category. Try selecting a different category or clearing filters."
                                : searchTerm 
                                    ? "No products found matching your search. Try different keywords or clearing filters."
                                    : "No products found. Please check back later."
                            }
                        </p>
                        {(selectedCategory || searchTerm) && (
                            <button 
                                onClick={() => {
                                    setSelectedCategory("");
                                    setSearchTerm("");
                                }}
                                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsPage;