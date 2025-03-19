import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ArrowLeft, Package, Truck, CheckCircle, Clock, AlertCircle, Edit, Save } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  customizations?: any;
  products: {
    name: string;
    image_url: string;
  };
}

interface Address {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  status_history: any[];
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  coupon_code?: string;
  payment_status: string;
  payment_method: string;
  tracking_number?: string;
  tracking_url?: string;
  notes?: string;
  shipping_address: Address;
  billing_address: Address;
  items: OrderItem[];
  user: {
    email: string;
    first_name: string;
    last_name: string;
  };
}

const OrderDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    status: '',
    trackingNumber: '',
    trackingUrl: '',
    notes: ''
  });

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          shipping_address:shipping_address_id (*),
          billing_address:billing_address_id (*),
          items:order_items (
            id,
            product_id,
            quantity,
            price,
            customizations,
            products:product_id (name, image_url)
          ),
          user:user_id (
            email,
            first_name,
            last_name
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        setError('Order not found');
        return;
      }
      
      setOrder(data);
      setEditForm({
        status: data.status,
        trackingNumber: data.tracking_number || '',
        trackingUrl: data.tracking_url || '',
        notes: data.notes || ''
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      setError('Failed to load order details');
      toast.error('Failed to load order details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateOrder = async () => {
    if (!order) return;
    
    try {
      const updates = {
        status: editForm.status,
        tracking_number: editForm.trackingNumber || null,
        tracking_url: editForm.trackingUrl || null,
        notes: editForm.notes || null,
        status_history: [
          ...(order.status_history || []),
          {
            status: editForm.status,
            timestamp: new Date().toISOString(),
            note: 'Status updated by admin'
          }
        ]
      };
      
      const { error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', order.id);
      
      if (error) throw error;
      
      toast.success('Order updated successfully');
      setIsEditing(false);
      fetchOrderDetails();
    } catch (error) {
      console.error('Error updating order:', error);
      toast.error('Failed to update order');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">{error || 'Order not found'}</h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find the order you're looking for.
          </p>
          <div className="mt-6">
            <Link
              to="/admin/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Details</h1>
          <p className="text-gray-600 mt-1">
            Order #{order.id.slice(0, 8)} • Placed on {format(new Date(order.created_at), 'MMMM d, yyyy')}
          </p>
        </div>
        <div className="flex space-x-4">
          <Link
            to="/admin/orders"
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Orders
          </Link>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Order
            </button>
          ) : (
            <button
              onClick={handleUpdateOrder}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Order Status */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Order Status</h2>
              {isEditing && (
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="ml-4 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm rounded-md"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="canceled">Canceled</option>
                </select>
              )}
            </div>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tracking Number
                  </label>
                  <input
                    type="text"
                    value={editForm.trackingNumber}
                    onChange={(e) => setEditForm({ ...editForm, trackingNumber: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tracking URL
                  </label>
                  <input
                    type="url"
                    value={editForm.trackingUrl}
                    onChange={(e) => setEditForm({ ...editForm, trackingUrl: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  />
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center space-x-2">
                  {order.status === 'pending' && <Clock className="h-5 w-5 text-yellow-500" />}
                  {order.status === 'processing' && <Package className="h-5 w-5 text-blue-500" />}
                  {order.status === 'shipped' && <Truck className="h-5 w-5 text-purple-500" />}
                  {order.status === 'delivered' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {order.status === 'canceled' && <AlertCircle className="h-5 w-5 text-red-500" />}
                  <span className="font-medium text-gray-900 capitalize">{order.status}</span>
                </div>
                
                {order.tracking_number && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Tracking Number: {order.tracking_number}</p>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-rose-600 hover:text-rose-500"
                      >
                        Track Package
                      </a>
                    )}
                  </div>
                )}
                
                {order.notes && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-md">
                    <p className="text-sm text-gray-700">{order.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Items */}
          <div className="bg-white rounded- lg shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Order Items</h2>
            </div>
            <ul className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <li key={item.id} className="px-6 py-4 flex items-center">
                  <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.products.image_url}
                      alt={item.products.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">
                          <Link to={`/admin/products/${item.product_id}`} className="hover:text-rose-600">
                            {item.products.name}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                        
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="mt-1 text-xs text-gray-500">
                            <span className="font-medium">Customizations: </span>
                            {Object.entries(item.customizations).map(([key, value]) => (
                              <span key={key} className="mr-2">
                                {key.charAt(0).toUpperCase() + key.slice(1)}: {value as string}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <p className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          {/* Customer Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3">
              <p className="text-sm text-gray-900">
                <span className="font-medium">{order.user.first_name} {order.user.last_name}</span>
              </p>
              <p className="text-sm text-gray-500">{order.user.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h2>
            <address className="text-sm text-gray-500 not-italic">
              <p>{order.shipping_address.name}</p>
              <p>{order.shipping_address.street}</p>
              <p>
                {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zip}
              </p>
              <p>{order.shipping_address.country}</p>
              <p className="mt-2">{order.shipping_address.phone}</p>
            </address>
          </div>

          {/* Billing Address */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h2>
            <address className="text-sm text-gray-500 not-italic">
              <p>{order.billing_address.name}</p>
              <p>{order.billing_address.street}</p>
              <p>
                {order.billing_address.city}, {order.billing_address.state} {order.billing_address.zip}
              </p>
              <p>{order.billing_address.country}</p>
              <p className="mt-2">{order.billing_address.phone}</p>
            </address>
          </div>

          {/* Payment Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Information</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Subtotal</dt>
                <dd className="text-sm font-medium text-gray-900">${order.subtotal.toFixed(2)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Shipping</dt>
                <dd className="text-sm font-medium text-gray-900">${order.shipping.toFixed(2)}</dd>
              </div>
              
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">Tax</dt>
                <dd className="text-sm font-medium text-gray-900">${order.tax.toFixed(2)}</dd>
              </div>
              
              {order.discount && order.discount > 0 && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">
                    Discount {order.coupon_code && `(${order.coupon_code})`}
                  </dt>
                  <dd className="text-sm font-medium text-green-600">-${order.discount.toFixed(2)}</dd>
                </div>
              )}
              
              <div className="border-t border-gray-200 pt-3 flex justify-between">
                <dt className="text-base font-medium text-gray-900">Total</dt>
                <dd className="text-base font-medium text-gray-900">${order.total.toFixed(2)}</dd>
              </div>
              
              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">Payment Method</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {order.payment_method === 'card' ? 'Credit/Debit Card' : 
                     order.payment_method === 'netbanking' ? 'Net Banking' :
                     order.payment_method === 'wallet' ? 'Wallet' :
                     order.payment_method === 'upi' ? 'UPI' :
                     order.payment_method === 'cod' ? 'Cash on Delivery' :
                     order.payment_method}
                  </dd>
                </div>
                
                <div className="flex justify-between mt-2">
                  <dt className="text-sm text-gray-500">Payment Status</dt>
                  <dd className={`text-sm font-medium ${
                    order.payment_status === 'paid' ? 'text-green-600' :
                    order.payment_status === 'pending' ? 'text-yellow-600' :
                    order.payment_status === 'failed' ? 'text-red-600' :
                    'text-gray-900'
                  }`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;