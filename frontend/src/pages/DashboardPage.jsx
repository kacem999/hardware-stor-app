import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import apiClient from "../api/axios"; // Ensure this path is correct based on your project

const DashboardPage = () => {

    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await apiClient.get('/user/orders');
                setOrders(response.data);
            } catch (error) {
                console.error("Failed to fetch orders:", error);

            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (!user) {
        return <div>Loading profile...</div>
    }


    return (
        <div className="bg-slate-50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                    Welcome, {user.name}!
                </h2>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Order History</h3>
                    {loading ? (
                        <p>Loading your orders...</p>
                    ) : orders.length === 0 ? (
                        <p>You haven't placed any orders yet.</p>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {orders.map(order => (
                                <div key={order.id} className="py-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="font-semibold">Order #{order.id}</p>
                                            <p className="text-sm text-gray-500">
                                                Placed on: {new Date(order.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-semibold">${order.total_amount}</p>
                                            <p className="text-sm text-gray-500 capitalize">{order.status}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4 text-sm text-gray-600">
                                        {order.items && order.items.map(item => (
                                            <p key={item.id}>- {item.product ? item.product.name : 'Product unavailable'} (x{item.quantity})</p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;