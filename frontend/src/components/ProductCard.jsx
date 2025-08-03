import React from 'react';
import { Link } from 'react-router-dom';
import Currency from './Currency'; // Import Currency component for price formatting

const ProductCard = ({ product }) => {
    // Handle image URL construction more robustly
    let imageUrl = 'https://placehold.co/300x300'; // Default fallback
    
    if (product.image) {
        // If the image URL already starts with http, use it as is
        if (product.image.startsWith('http')) {
            imageUrl = product.image;
        } 
        // If it starts with /storage, prepend the base URL
        else if (product.image.startsWith('/storage')) {
            imageUrl = `http://127.0.0.1:8000${product.image}`;
        }
        // Otherwise, assume it's a relative path and construct accordingly
        else {
            imageUrl = `http://127.0.0.1:8000/storage/${product.image}`;
        }
    }

    return (
        <Link to={`/products/${product.id}`} className="group">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Placeholder for an image */}
                <div className="aspect-square w-full overflow-hidden flex items-center justify-center bg-white">
                    <img 
                        src={imageUrl}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain p-2"
                        onError={(e) => { e.target.src = 'https://placehold.co/300x300'; }}
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-900">
                            <Currency value={product.price} />
                        </p>
                        {product.stock_quantity > 0 ? (
                            <span className="text-sm px-2 py-1 bg-green-100 text-green-800 rounded-md">In Stock</span>
                        ) : (
                            <span className="text-sm px-2 py-1 bg-red-100 text-red-800 rounded-md">Out of Stock</span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );

};

export default ProductCard;
