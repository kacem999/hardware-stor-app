import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        shipping_address_line_1: '',
        city: '',
        postal_code: '',
    });
    const [error, setError] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!shippingInfo.shipping_address_line_1 || !shippingInfo.city || !shippingInfo.postal_code) {
            setError('Please fill in all shipping details.');
            return;
        }
        setError('');
        setIsPlacingOrder(true);

        try {
            await apiClient.post('/orders', shippingInfo);
            alert('Order placed successfully!');
            clearCart();
            navigate('/dashboard');
        } catch (err) {
            console.error('Failed to place order:', err);
            setError('Failed to place order. Please try again.');
        } finally {
            setIsPlacingOrder(false);
        }
    };
    
    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form - takes up 2 columns */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Shipping Information</h3>
                        <form>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="shipping_address_line_1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                                    <input type="text" id="shipping_address_line_1" name="shipping_address_line_1" value={shippingInfo.shipping_address_line_1} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                    <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                                </div>
                                <div>
                                    <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                    <input type="text" id="postal_code" name="postal_code" value={shippingInfo.postal_code} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"/>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary - takes up 1 column */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h3>
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                    <span className="font-medium text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">${totalPrice.toFixed(2)}</span>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <button 
                            onClick={handlePlaceOrder} 
                            disabled={isPlacingOrder}
                            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed"
                        >
                            {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;