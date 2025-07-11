import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {

    return (
        <Link to={`/products/${product.id}`} className="group">
            <div className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
                {/* Placeholder for an image */}
                <div className="w-full h-48 bg-gray-200"></div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 truncate group-hover:text-blue-600">
                        {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{product.category.name}</p>
                    <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-gray-900">${product.price}</p>
                        <p className="text-sm text-gray-600">In Stock: {product.stock_quantity}</p>
                    </div>
                </div>
            </div>
        </Link>
    );

};

export default ProductCard;
