// In frontend/src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import Currency from '../components/Currency';

const CartPage = () => {
    // Get the new functions from the context
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    // Helper function to get the image URL for a product
    const getImageUrl = (item) => {
        if (!item.image) return 'https://placehold.co/100x100';
        
        if (item.image.startsWith('http')) {
            return item.image;
        } else if (item.image.startsWith('/storage')) {
            return `http://127.0.0.1:8000${item.image}`;
        } else {
            return `http://127.0.0.1:8000/storage/${item.image}`;
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Your Shopping Cart</h2>
                
                {cartItems.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-lg shadow-md">
                        <p className="text-lg text-gray-600">Your cart is empty.</p>
                        <Link to="/products" className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md">
                        {/* Cart Items List */}
                        <div className="divide-y divide-gray-200">
                            {cartItems.map(item => (
                                <div key={item.id} className="p-4 flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-16 h-16 rounded-md overflow-hidden flex items-center justify-center bg-gray-100">
                                            {/* Display product image with fallback */}
                                            <img 
                                                src={getImageUrl(item)} 
                                                alt={item.name} 
                                                className="object-cover w-full h-full"
                                                onError={(e) => {e.target.src = 'https://placehold.co/100x100'}}
                                            />
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-semibold text-gray-800">{item.name}</h4>
                                            <p className="text-sm text-gray-500"><Currency value={item.price} /></p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <label htmlFor={`quantity-${item.id}`} className="text-sm text-gray-600">Qty:</label>
                                            <input
                                                id={`quantity-${item.id}`}
                                                type="number"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                                min="1"
                                                className="w-16 p-1 border border-gray-300 rounded-md text-center"
                                            />
                                        </div>
                                        <p className="w-24 text-right font-semibold text-gray-800">
                                            <Currency value={item.price * item.quantity} />
                                        </p>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 font-medium">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {/* Cart Summary */}
                        <div className="p-4 bg-gray-50 rounded-b-lg border-t">
                            <div className="flex justify-end items-center space-x-4">
                                <span className="text-xl font-medium text-gray-800">Total:</span>
                                <span className="text-2xl font-bold text-gray-900">
                                    <Currency value={totalPrice} />
                                </span>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Link to="/checkout" className="w-full sm:w-auto bg-blue-600 text-white py-2 px-6 rounded-md text-center hover:bg-blue-700">
                                    Proceed to Checkout
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;