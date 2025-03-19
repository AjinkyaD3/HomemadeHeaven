import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { format } from 'date-fns';

const PaymentSuccessPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('order_id');
  const { user } = useAuth();
  
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user || !orderId) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            created_at,
            total,
            status,
            payment_status,
            order_items (
              id,
              quantity,
              products:product_id (name)
            )
          `)
          .eq('id', orderId)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        
        if (!data) {
          setError('Order not found');
          setIsLoading(false);
          return;
        }
        
        // Update order status if it's still pending
        if (data.status === 'pending') {
          const { error: updateError } = await supabase
            .from('orders')
            .update({
              status: 'confirmed',
              payment_status: 'paid',
              status_history: [
                {
                  status: 'pending',
                  timestamp: data.created_at,
                  note: 'Order placed'
                },
                {
                  status: 'confirmed',
                  timestamp: new Date().toISOString(),
                  note: 'Payment confirmed'
                }
              ]
            })
            .eq('id', orderId);
          
          if (updateError) throw updateError;
          
          // Also update the data object
          data.status = 'confirmed';
          data.payment_status = 'paid';
        }
        
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, orderId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
          <p className="text-gray-600 mb-6">{error || 'We could not find the order you are looking for.'}</p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/account/orders"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              View Your Orders
            </Link>
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalItems = order.order_items.reduce((sum: number, item: any) => sum + item.quantity, 0);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8 border-b border-gray-200 text-center">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-green-100 text-green-600 mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Thank You!</h1>
            <p className="text-xl text-gray-600">Your order has been confirmed</p>
          </div>
          
          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Order Information</h2>
              <div className="bg-gray-50 rounded-md p-4">
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                  <div>
                    <dt className="text-gray-500">Order number</dt>
                    <dd className="font-medium text-gray-900 mt-1">#{order.id.slice(0, 8)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Date placed</dt>
                    <dd className="font-medium text-gray-900 mt-1">
                      {format(new Date(order.created_at), 'MMMM d, yyyy')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Total amount</dt>
                    <dd className="font-medium text-gray-900 mt-1">${order.total.toFixed(2)}</dd>
                  </div>
                  <div>
                    <dt className="text-gray-500">Payment status</dt>
                    <dd className="font-medium text-green-600 mt-1">
                      {order.payment_status === 'paid' ? 'Paid' : 'Pending'}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">Order Summary</h2>
              <p className="text-gray-600 mb-4">
                {totalItems} {totalItems === 1 ? 'item' : 'items'} in your order
              </p>
              
              <ul className="divide-y divide-gray-200 border-t border-b border-gray-200">
                {order.order_items.map((item: any) => (
                  <li key={item.id} className="py-3 flex justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-900 font-medium">{item.quantity} x</span>
                      <span className="ml-2 text-gray-600">{item.products.name}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-2">What's Next?</h2>
              <p className="text-gray-600 mb-4">
                You will receive an email confirmation shortly at your registered email address. 
                We'll notify you when your order has been shipped.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:justify-between space-y-4 sm:space-y-0">
              <Link
                to="/account/orders"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <ShoppingBag className="mr-2 h-5 w-5" />
                View Order History
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Continue Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;