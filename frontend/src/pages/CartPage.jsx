import { useCart } from "../context/CartContext";

const CartPage = () => {
    const { cartItems } = useCart();

    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div>
            <h2>Your Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <p>Your Cart is empty. </p>
            ) : (
                <div>
                    {cartItems.map(item => (
                        <div key={item.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
                            <h4>{item.name}</h4>
                            <p>Price: ${item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Subtotal: ${(item.price * item.quantity).toFixed(2)}</p>
                        </div>
                    ))}
                    <h3 style={{ marginTop: '1rem' }}>Total: ${totalPrice.toFixed(2)}</h3>
                </div>
            )}
        </div>
    );
};

export default CartPage;


















