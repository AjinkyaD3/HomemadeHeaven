import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success('Added to cart');
  };

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/placeholder-image.jpg';
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden">
          <img 
            src={`${import.meta.env.VITE_API_URL}${product.image}`}
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={handleImageError}
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          <button 
            onClick={handleToggleFavorite}
            className={`absolute top-2 right-2 p-1.5 rounded-full focus:outline-none ${
              isFavorite(product._id)
                ? 'bg-rose-100 text-rose-500 hover:bg-rose-200'
                : 'bg-white text-gray-400 hover:text-rose-500 hover:bg-rose-50'
            } transition-colors duration-300`}
            aria-label={isFavorite(product._id) ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
              className={`p-2 rounded-full ${
                product.isAvailable 
                  ? 'bg-rose-100 text-rose-600 hover:bg-rose-600 hover:text-white' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } transition-colors duration-300`}
              aria-label="Add to cart"
            >
              <ShoppingCart className="h-5 w-5" />
            </button>
          </div>
          
          {product.customizable && (
            <span className="block mt-2 text-xs text-rose-600 font-medium">
              Customizable
            </span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;