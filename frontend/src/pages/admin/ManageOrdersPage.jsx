import { useState, useEffect } from "react";
import apiClient from "../../api/axios";
import Modal from "../../components/Modal"; 
import Currency from "../../components/Currency";


const ManageOrdersPage = () => {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [newStatus, setNewStatus] = useState(''); 

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/orders');
            setOrders(response.data);
        } catch (err) {
            setError('Failed to fetch orders');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setIsModalOpen(true);
    }

    const handleStatusUpdate = async () => {
        if (!selectedOrder || !newStatus) return;
        
        try {
            console.log('Updating order status:', selectedOrder.id, 'to', newStatus);
            await apiClient.put(`/orders/${selectedOrder.id}`, { status: newStatus });
            alert('Order status updated successfully');
            setIsModalOpen(false);
            fetchOrders(); // Refresh the order list
        } catch (error) {
            console.error('Failed to update order status:', error);
            alert('An error occurred while updating the order status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-green-100 text-green-800';
            case 'delivered':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    

    if (loading) return <div className="text-center p-8">Loading orders...</div>;
    if (error) return <div className="text-center p-8 text-red-500">{error}</div>;



    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Manage Orders</h1>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer_name || order.user.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><Currency value={order.total_amount} /></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                                        {order.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => handleViewDetails(order)} 
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        View Details
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Order #${selectedOrder.id} Details`}>
                    <div className="text-sm">
                        <p><strong>Account:</strong> {selectedOrder.user.name}</p>
                        <p><strong>Status:</strong> <span className="font-semibold uppercase">{selectedOrder.status}</span></p>
                        <p><strong>Total:</strong> <Currency value={selectedOrder.total_amount} /></p>
                        <div className="mt-4">
                            <h4 className="font-semibold">Shipping Information:</h4>
                            <p><strong>Customer:</strong> {selectedOrder.customer_name}</p>
                            <p><strong>Phone:</strong> {selectedOrder.customer_phone}</p>
                            <p><strong>Address:</strong> {selectedOrder.address}</p>
                            <p><strong>Location:</strong> {selectedOrder.commune}, {selectedOrder.wilaya}</p>
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold">Items Ordered:</h4>
                            <ul className="list-disc list-inside mt-2 space-y-1">
                                {selectedOrder.items.map(item => (
                                    <li key={item.id}>
                                        {item.product.name} - {item.quantity} x <Currency value={item.price} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="mt-6 border-t pt-4">
                            <h4 className="font-semibold">Update Status</h4>
                            <div className="mt-2 flex items-center space-x-4">
                                <select 
                                    value={newStatus} 
                                    onChange={(e) => setNewStatus(e.target.value)}
                                    className="block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <button 
                                    onClick={handleStatusUpdate}
                                    className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default ManageOrdersPage;