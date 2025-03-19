import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
    toast.success('Item removed from cart');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-gray-500">
            Looks like you haven't added any items to your cart yet.
          </p>
          <div className="mt-6">
            <Link
              to="/shop"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              {cart.map((item) => (
                <div key={`${item.product.id}-${JSON.stringify(item.customizations)}`} className="py-6 flex flex-col sm:flex-row">
                  <div className="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>

                  <div className="flex-1 ml-0 sm:ml-6 mt-4 sm:mt-0">
                    <div className="flex justify-between">
                      <div>
                        <h3 className="text-base font-medium text-gray-900">
                          <Link to={`/product/${item.product.id}`}>
                            {item.product.name}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                          ₹{item.product.price.toFixed(2)} each
                        </p>
                        
                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                          <div className="mt-2 text-sm text-gray-700">
                            <h4 className="font-medium">Customizations:</h4>
                            <ul className="list-disc list-inside pl-2 mt-1">
                              {item.customizations.color && (
                                <li>Color: {item.customizations.color}</li>
                              )}
                              {item.customizations.material && (
                                <li>Material: {item.customizations.material}</li>
                              )}
                              {item.customizations.size && (
                                <li>Size: {item.customizations.size}</li>
                              )}
                              {item.customizations.engraving && (
                                <li>Engraving: "{item.customizations.engraving}"</li>
                              )}
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-base font-medium text-gray-900">
                        ₹{(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="flex items-center">
                        <label htmlFor={`quantity-${item.product.id}`} className="sr-only">
                          Quantity
                        </label>
                        <select
                          id={`quantity-${item.product.id}`}
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.product.id, parseInt(e.target.value))}
                          className="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => handleRemove(item.product.id)}
                        className="text-sm font-medium text-rose-600 hover:text-rose-500 flex items-center"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <button
                type="button"
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear cart
              </button>
            </div>
          </div>
          
          <div className="mt-8 lg:mt-0 lg:col-span-4">
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900">₹{totalPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Shipping</p>
                  <p className="text-sm font-medium text-gray-900">Calculated at checkout</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-sm text-gray-600">Tax</p>
                  <p className="text-sm font-medium text-gray-900">Calculated at checkout</p>
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between">
                    <p className="text-base font-medium text-gray-900">Order total</p>
                    <p className="text-base font-medium text-gray-900">₹{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-rose-600 border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Proceed to Checkout
                </button>
              </div>
              
              <div className="mt-4 text-center">
                <Link
                  to="/shop"
                  className="text-sm font-medium text-rose-600 hover:text-rose-500 flex items-center justify-center"
                >
                  <ArrowLeft className="mr-1 h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;