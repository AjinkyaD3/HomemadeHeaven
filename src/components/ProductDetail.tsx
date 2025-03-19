import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    toast.success('Added to cart');
  };

  const handleToggleFavorite = async () => {
    if (!product || !user) {
      toast.error('Please sign in to save favorites');
      return;
    }
    try {
      if (isFavorite(product._id)) {
        await removeFromFavorites(product._id);
      } else {
        await addToFavorites(product._id);
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="relative">
          <img
            src={`${import.meta.env.VITE_API_URL}${product.image}`}
            alt={product.name}
            className="w-full h-auto rounded-lg shadow-lg"
            onError={(e) => {
              e.currentTarget.src = '/placeholder-image.jpg';
            }}
          />
          {product.featured && (
            <span className="absolute top-4 left-4 bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Product Info Section */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="mt-2 flex items-center">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="ml-2 text-sm text-gray-500">
                ({product.numReviews} reviews)
              </span>
            </div>
          </div>

          <p className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</p>

          <p className="text-gray-600">{product.description}</p>

          <div className="flex items-center space-x-4">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 text-gray-600 hover:text-gray-900"
              >
                -
              </button>
              <span className="px-3 py-1 border-x">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 text-gray-600 hover:text-gray-900"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`flex items-center px-6 py-3 rounded-lg ${
                product.isAvailable
                  ? 'bg-rose-600 text-white hover:bg-rose-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="h-5 w-5 mr-2" />
              {product.isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={handleToggleFavorite}
              className={`p-3 rounded-full ${
                isFavorite(product._id)
                  ? 'bg-rose-100 text-rose-500'
                  : 'bg-gray-100 text-gray-400 hover:text-rose-500'
              }`}
            >
              <Heart className="h-5 w-5" />
            </button>
          </div>

          {product.customizable && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Customization Options</h3>
              <p className="mt-1 text-sm text-gray-500">
                This product can be customized. Please contact us for custom orders.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 