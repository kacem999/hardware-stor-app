import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import apiClient from '../api/axios';
import Currency from '../components/Currency'; // Import Currency component for price formatting
import algeriaData from '../data/algeria-cities.json'; // Import local data for cities

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const [shippingInfo, setShippingInfo] = useState({
        'customer_name': user?.name || '',
        'customer_phone': '',
        'wilaya': '',
        'commune': '',
        'address': '',
    });
    const [wilayas, setWilayas] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [loadingWilayas, setLoadingWilayas] = useState(true);
    const [error, setError] = useState('');
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!shippingInfo.customer_name || !shippingInfo.customer_phone || !shippingInfo.wilaya || !shippingInfo.commune || !shippingInfo.address) {
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

    useEffect(() => {
        // Load wilayas from local data
        const loadWilayas = () => {
            try {
                setWilayas(algeriaData.wilayas);
            } catch (error) {
                console.error('Error loading wilayas:', error);
            } finally {
                setLoadingWilayas(false);
            }
        };
        loadWilayas();
    }, []);

    useEffect(() => {
        if (shippingInfo.wilaya) {
            const selectedWilayaObject = wilayas.find(w => w.name === shippingInfo.wilaya);
            if (selectedWilayaObject) {
                // Load communes from local data
                try {
                    const wilayaId = selectedWilayaObject.id.toString();
                    // Check if we have communes for this wilaya in our data
                    if (algeriaData.communes[wilayaId]) {
                        setCommunes(algeriaData.communes[wilayaId]);
                    } else {
                        // If we don't have specific communes for this wilaya, provide empty array or default options
                        setCommunes([
                            { id: 1, name: "Centre Ville", wilaya_id: selectedWilayaObject.id },
                            { id: 2, name: "Périphérie", wilaya_id: selectedWilayaObject.id }
                        ]);
                    }
                } catch (err) {
                    console.error('Failed to load communes:', err);
                    setCommunes([]);
                }
            }
        } else {
            setCommunes([]);
        }
    }, [shippingInfo.wilaya, wilayas]);

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div className="bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Checkout</h2>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Shipping Information</h3>
                        <form>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" id="customer_name" name="customer_name" value={shippingInfo.customer_name} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                                </div>
                                <div>
                                    <label htmlFor="customer_phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                    <input type="tel" id="customer_phone" name="customer_phone" value={shippingInfo.customer_phone} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                                </div>
                                <div>
                                    <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-1">Wilaya</label>
                                    <select id="wilaya" name="wilaya" value={shippingInfo.wilaya} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md">
                                        <option value="">{loadingWilayas ? 'Loading...' : 'Select a Wilaya'}</option>
                                        {wilayas.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-1">Commune</label>
                                    <select id="commune" name="commune" value={shippingInfo.commune} onChange={handleChange} required disabled={!shippingInfo.wilaya} className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100">
                                        <option value="">Select a Commune</option>
                                        {communes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                                    <input type="text" id="address" name="address" value={shippingInfo.address} onChange={handleChange} required className="w-full p-2 border border-gray-300 rounded-md"/>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
                        {/* ... Order Summary JSX remains the same ... */}
                        <h3 className="text-xl font-semibold mb-6 text-gray-800">Order Summary</h3>
                        <div className="space-y-3">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex justify-between text-sm">
                                    <span className="text-gray-600">{item.name} x {item.quantity}</span>
                                    <span className="font-medium text-gray-800">
                                        <Currency value={item.price * item.quantity} />
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="border-t my-4"></div>
                        <div className="flex justify-between text-lg font-bold">
                            <span className="text-gray-900">Total</span>
                            <span className="text-gray-900">
                                <Currency value={totalPrice} />
                            </span>
                        </div>
                        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
                        <button 
                            onClick={handlePlaceOrder} 
                            disabled={isPlacingOrder}
                            className="w-full mt-6 bg-[#dc6b01] text-white py-3 rounded-md text-lg font-semibold hover:bg-[#b55a01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc6b01] disabled:bg-[#ee8422] disabled:cursor-not-allowed"
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