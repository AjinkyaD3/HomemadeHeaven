import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { api } from '../../services/api';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

interface Order {
  _id: string;
  userId: {
    _id: string;
    email: string;
    fullName: string;
  };
  items: Array<{
    product: {
      _id: string;
      name: string;
      price: number;
      image: string;
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'canceled' | 'refunded';
  paymentStatus: string;
  createdAt: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    phone: string;
  };
}

const validTransitions = {
    pending: ['confirmed', 'canceled'],
    confirmed: ['processing', 'canceled'],
    processing: ['shipped', 'canceled'],
    shipped: ['delivered', 'canceled'],
    delivered: ['refunded'],
    canceled: ['confirmed'],
    refunded: []
};

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const data = await api.getOrderById(id!);
        setOrder(data);
      } catch (err: any) {
        setError(err.message);
        toast.error('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: Order['status']) => {
    try {
      await api.updateOrderStatus(order!._id, newStatus);
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      toast.success('Order status updated successfully');
    } catch (err: any) {
      toast.error('Failed to update order status');
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Orders
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">Order #{order._id.slice(-6)}</h1>
            <p className="text-gray-600">
              Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <select
              value={order.status}
              onChange={(e) => handleStatusUpdate(e.target.value as Order['status'])}
              className="border rounded-lg px-4 py-2 mb-2 focus:outline-none focus:ring-2 focus:ring-rose-500"
              disabled={!validTransitions[order.status]?.length}
            >
              <option value={order.status}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</option>
              {validTransitions[order.status]?.map(status => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' :
              order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              Payment: {order.paymentStatus}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Customer Information</h2>
            <div className="bg-gray-50 rounded p-4">
              <p className="font-medium">{order.userId.fullName}</p>
              <p className="text-gray-600">{order.userId.email}</p>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
            <div className="bg-gray-50 rounded p-4">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>{order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Items</h2>
          <div className="border rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-image.jpg';
                          }}
                        />
                        <div className="ml-4">
                          <p className="font-medium">{item.product.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">₹{item.product.price}</td>
                    <td className="px-6 py-4">{item.quantity}</td>
                    <td className="px-6 py-4">₹{item.price * item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="w-72">
            <div className="border-t pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Total</span>
                <span className="font-bold">₹{order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;