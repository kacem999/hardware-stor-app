// In frontend/src/pages/CartPage.jsx
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
    // Get the new functions from the context
    const { cartItems, removeFromCart, updateQuantity } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <div>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                            <div>
                                <h4>{item.name}</h4>
                                <p>Price: ${item.price}</p>
                                <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <label htmlFor={`quantity-${item.id}`}>Quantity:</label>
                                <input
                                    id={`quantity-${item.id}`}
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                                    min="1"
                                    style={{ width: '60px' }}
                                />
                                <button onClick={() => removeFromCart(item.id)} style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}>
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                    <h3 style={{ marginTop: '1rem', textAlign: 'right' }}>Total: ${totalPrice.toFixed(2)}</h3>
                    {cartItems.length > 0 && (
                        <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                            <Link to="/checkout">
                                <button>Proceed to Checkout</button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CartPage;