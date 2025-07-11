import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axios";

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [shippingInfo, setShippingInfo] = useState({
        'shipping_address_line_1': '',
        'city': '',
        'postal_code': '',
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        if (!shippingInfo.shipping_address_line_1 || !shippingInfo.city || !shippingInfo.postal_code) {
            setError('Please fill in all shipping information fields.');
            return;
        }
        setError('');
        try {
            await apiClient.post('/orders', shippingInfo);
            alert('Order placed successfully!');
            clearCart(); 
            navigate('/dashboard');
        } catch (err){
            console.error('Failed to place order:', err);
            setError('Failed to place order. Please try again.');
        }
    };

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div>
            <h2>Checkout</h2>
            <div style={{ display: 'flex', gap: '2rem' }}>
                {/* Shipping Details Form */}
                <div style={{ flex: 1 }}>
                    <h4>Shipping Address</h4>
                    <form>
                        <div>
                            <label htmlFor="shipping_address_line_1">Address Line 1</label>
                            <input type="text" id="shipping_address_line_1" name="shipping_address_line_1" value={shippingInfo.shipping_address_line_1} onChange={handleChange} required style={{width: '100%'} }/>
                        </div>
                        <div>
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" name="city" value={shippingInfo.city} onChange={handleChange} required style={{width: '100%'}}/>
                        </div>
                        <div>
                            <label htmlFor="postal_code">Postal Code</label>
                            <input type="text" id="postal_code" name="postal_code" value={shippingInfo.postal_code} onChange={handleChange} required style={{width: '100%'}}/>
                        </div>
                    </form>
                </div>

                {/* Order Summary */}
                <div style={{ flex: 1 }}>
                    <h4>Order Summary</h4>
                    {cartItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>{item.name} x {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
                        <span>Total</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <button onClick={handlePlaceOrder} style={{ width: '100%', marginTop: '1rem' }}>Place Order</button>
                </div>
            </div>
        </div>
    );
};
export default CheckoutPage;