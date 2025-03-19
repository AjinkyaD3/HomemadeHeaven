import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { supabase } from '../../lib/supabase';
import { CreditCard, Truck, ShoppingBag, ChevronDown, ChevronUp, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  is_default: boolean;
}

const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoadingAddresses, setIsLoadingAddresses] = useState(true);
  const [selectedShippingAddress, setSelectedShippingAddress] = useState<string | null>(null);
  const [selectedBillingAddress, setSelectedBillingAddress] = useState<string | null>(null);
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  
  // Calculate order totals
  const subtotal = totalPrice;
  const shippingCost = subtotal > 100 ? 0 : 10;
  const taxRate = 0.08; // 8% tax rate
  const taxAmount = subtotal * taxRate;
  const discountAmount = appliedCoupon ? 
    (appliedCoupon.type === 'percentage' ? 
      (subtotal * appliedCoupon.value / 100) : 
      appliedCoupon.value) : 0;
  const finalTotal = subtotal + shippingCost + taxAmount - discountAmount;

  // Fetch user addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });
        
        if (error) throw error;
        
        setAddresses(data || []);
        
        // Set default addresses
        const defaultAddress = data?.find(addr => addr.is_default);
        if (defaultAddress) {
          setSelectedShippingAddress(defaultAddress.id);
          setSelectedBillingAddress(defaultAddress.id);
        } else if (data && data.length > 0) {
          setSelectedShippingAddress(data[0].id);
          setSelectedBillingAddress(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching addresses:', error);
        toast.error('Failed to load addresses');
      } finally {
        setIsLoadingAddresses(false);
      }
    };

    fetchAddresses();
  }, [user]);

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
  }, [cart, navigate]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    setIsApplyingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.trim())
        .eq('is_active', true)
        .single();
      
      if (error) {
        toast.error('Invalid coupon code');
        return;
      }
      
      // Check if coupon is expired
      const now = new Date();
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      
      if (now < startDate || now > endDate) {
        toast.error('Coupon is expired or not yet active');
        return;
      }
      
      // Check if minimum purchase requirement is met
      if (data.min_purchase && subtotal < data.min_purchase) {
        toast.error(`Minimum purchase of ₹${data.min_purchase.toFixed(2)} required for this coupon`);
        return;
      }
      
      // Apply the coupon
      setAppliedCoupon(data);
      toast.success('Coupon applied successfully');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Failed to apply coupon');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please sign in to place an order');
      return;
    }
    
    if (!selectedShippingAddress) {
      toast.error('Please select a shipping address');
      return;
    }
    
    if (!sameAsShipping && !selectedBillingAddress) {
      toast.error('Please select a billing address');
      return;
    }
    
    const billingAddressId = sameAsShipping ? selectedShippingAddress : selectedBillingAddress;
    
    setIsProcessingOrder(true);
    try {
      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          shipping_address_id: selectedShippingAddress,
          billing_address_id: billingAddressId,
          subtotal: subtotal,
          shipping: shippingCost,
          tax: taxAmount,
          discount: discountAmount,
          total: finalTotal,
          coupon_code: appliedCoupon?.code || null,
          status: 'pending',
          payment_status: 'pending',
          payment_method: 'card', // Default to card for now
          status_history: [
            {
              status: 'pending',
              timestamp: new Date().toISOString(),
              note: 'Order placed'
            }
          ]
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
        customizations: item.customizations || null,
        variation_id: item.variation?.id || null
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Create payment intent
      const { error: paymentError } = await supabase
        .from('payment_intents')
        .insert({
          order_id: order.id,
          amount: finalTotal,
          currency: 'usd',
          status: 'created'
        });
      
      if (paymentError) throw paymentError;
      
      // Clear the cart
      clearCart();
      
      // Redirect to payment success page
      navigate(`/checkout/success?order_id=${order.id}`);
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (isLoadingAddresses) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your purchase</p>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Main content */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
              
              {addresses.length === 0 ? (
                <div className="bg-gray-50 rounded-md p-4 text-center">
                  <p className="text-gray-500 mb-4">You don't have any saved addresses.</p>
                  <button
                    onClick={() => navigate('/account/addresses')}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div>
                  <div className="space-y-4">
                    {addresses.map((address) => (
                      <div key={address.id} className="relative border rounded-md p-4">
                        <div className="flex items-start">
                          <div className="flex items-center h-5">
                            <input
                              id={`shipping-${address.id}`}
                              name="shipping-address"
                              type="radio"
                              checked={selectedShippingAddress === address.id}
                              onChange={() => setSelectedShippingAddress(address.id)}
                              className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                            />
                          </div>
                          <div className="ml-3 text-sm">
                            <label htmlFor={`shipping-${address.id}`} className="font-medium text-gray-900">
                              {address.name}
                            </label>
                            <p className="text-gray-500 mt-1">
                              {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                            </p>
                            <p className="text-gray-500 mt-1">{address.phone}</p>
                          </div>
                        </div>
                        {address.is_default && (
                          <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Default
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <button
                      onClick={() => navigate('/account/addresses')}
                      className="text-sm text-rose-600 hover:text-rose-500"
                    >
                      Add New Address
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Billing Information</h2>
              
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    id="same-as-shipping"
                    name="billing-option"
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={() => setSameAsShipping(!sameAsShipping)}
                    className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                  />
                  <label htmlFor="same-as-shipping" className="ml-2 block text-sm text-gray-900">
                    Same as shipping address
                  </label>
                </div>
              </div>
              
              {!sameAsShipping && (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="relative border rounded-md p-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`billing-${address.id}`}
                            name="billing-address"
                            type="radio"
                            checked={selectedBillingAddress === address.id}
                            onChange={() => setSelectedBillingAddress(address.id)}
                            className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`billing-${address.id}`} className="font-medium text-gray-900">
                            {address.name}
                          </label>
                          <p className="text-gray-500 mt-1">
                            {address.street}, {address.city}, {address.state} {address.zip}, {address.country}
                          </p>
                          <p className="text-gray-500 mt-1">{address.phone}</p>
                        </div>
                      </div>
                      {address.is_default && (
                        <span className="absolute top-2 right-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Default
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
              
              <div className="space-y-4">
                <div className="relative border rounded-md p-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="payment-card"
                        name="payment-method"
                        type="radio"
                        checked={true}
                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="payment-card" className="font-medium text-gray-900">
                        Credit / Debit Card
                      </label>
                      <p className="text-gray-500 mt-1">
                        Pay securely with your credit or debit card
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 pl-7">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label htmlFor="card-number" className="block text-sm font-medium text-gray-700">
                          Card Number
                        </label>
                        <input
                          type="text"
                          id="card-number"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="expiration" className="block text-sm font-medium text-gray-700">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          id="expiration"
                          placeholder="MM/YY"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          placeholder="123"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label htmlFor="name-on-card" className="block text-sm font-medium text-gray-700">
                          Name on Card
                        </label>
                        <input
                          type="text"
                          id="name-on-card"
                          placeholder="John Doe"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>
                  <button
                    type="button"
                    className="lg:hidden text-gray-400 hover:text-gray-500"
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                  >
                    <span className="sr-only">
                      {showOrderSummary ? 'Hide order summary' : 'Show order summary'}
                    </span>
                    {showOrderSummary ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
              
              <div className={`lg:block ${showOrderSummary ? 'block' : 'hidden'}`}>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={`${item.product.id}-${JSON.stringify(item.customizations)}`} className="p-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-sm font-medium text-gray-900">
                            {item.product.name}
                          </h3>
                          <p className="text-sm font-medium text-gray-900">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">Qty {item.quantity}</p>
                        
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
                    </li>
                  ))}
                </ul>
                
                <div className="p-6 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-900">Coupon Code</h3>
                    {appliedCoupon && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <Check className="mr-1 h-3 w-3" />
                        Applied
                      </span>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={!!appliedCoupon}
                      placeholder="Enter coupon code"
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                    {appliedCoupon ? (
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                      >
                        {isApplyingCoupon ? (
                          <>
                            <LoadingSpinner size="small" color="white" />
                            <span className="ml-2">Applying...</span>
                          </>
                        ) : (
                          'Apply'
                        )}
                      </button>
                    )}
                  </div>
                  
                  {appliedCoupon && (
                    <p className="mt-2 text-sm text-gray-500">
                      {appliedCoupon.type === 'percentage' 
                        ? `${appliedCoupon.value}% off your order` 
                        : `₹${appliedCoupon.value.toFixed(2)} off your order`}
                    </p>
                  )}
                </div>
                
                <div className="p-6 border-t border-gray-200">
                  <dl className="space-y-4">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Subtotal</dt>
                      <dd className="text-sm font-medium text-gray-900">₹{subtotal.toFixed(2)}</dd>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Shipping</dt>
                      <dd className="text-sm font-medium text-gray-900">
                        {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                      </dd>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <dt className="text-sm text-gray-600">Tax (8%)</dt>
                      <dd className="text-sm font-medium text-gray-900">₹{taxAmount.toFixed(2)}</dd>
                    </div>
                    
                    {appliedCoupon && (
                      <div className="flex items-center justify-between">
                        <dt className="text-sm text-gray-600">Discount</dt>
                        <dd className="text-sm font-medium text-green-600">-₹{discountAmount.toFixed(2)}</dd>
                      </div>
                    )}
                    
                    <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">Order Total</dt>
                      <dd className="text-base font-medium text-gray-900">₹{finalTotal.toFixed(2)}</dd>
                    </div>
                  </dl>
                  
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handlePlaceOrder}
                      disabled={isProcessingOrder || addresses.length === 0}
                      className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 disabled:opacity-50"
                    >
                      {isProcessingOrder ? (
                        <>
                          <LoadingSpinner size="small" color="white" />
                          <span className="ml-2">Processing...</span>
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                      By placing your order, you agree to our{' '}
                      <a href="/terms" className="text-rose-600 hover:text-rose-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="/privacy-policy" className="text-rose-600 hover:text-rose-500">
                        Privacy Policy
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;