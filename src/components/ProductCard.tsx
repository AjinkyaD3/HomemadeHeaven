import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative pb-[100%] overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          {product.featured && (
            <span className="absolute top-2 left-2 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
          <button 
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full text-gray-400 hover:text-rose-500 focus:outline-none"
            aria-label="Add to favorites"
          >
            <Heart className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`p-2 rounded-full ${
                product.inStock 
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