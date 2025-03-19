import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { Product } from '../types';

const ProductDetailPage: React.FC = () => {
   const backendURl = "http://localhost:5000"
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedCustomizations, setSelectedCustomizations] = useState<{
    color?: string;
    material?: string;
    engraving?: string;
    size?: string;
  }>({});
  
  const [addedToCart, setAddedToCart] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('Invalid product ID');
        setLoading(false);
        return;
      }

      try {
        const data = await api.getProduct(id);
        setProduct(data);
        
        // Fetch related products based on category
        const allProducts = await api.getProducts();
        const related = allProducts
          .filter(p => p.category === data.category && p._id !== id)
          .slice(0, 4);
        setRelatedProducts(related);
      } catch (err) {
        setError('Failed to fetch product details');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);
  
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
        <p className="text-gray-500 mb-8">{error}</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Shop
        </Link>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
        <p className="text-gray-500 mb-8">The product you're looking for doesn't exist or has been removed.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700"
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Shop
        </Link>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity, Object.keys(selectedCustomizations).length > 0 ? selectedCustomizations : undefined);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };
  
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-400 hover:text-gray-500">Home</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link to="/shop" className="text-gray-400 hover:text-gray-500">Shop</Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                to={`/shop?category=${product.category}`} 
                className="text-gray-400 hover:text-gray-500"
              >
                {product.category === 'frame' ? 'Frames' : 'Gifts'}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-700 font-medium">{product.name}</li>
          </ol>
        </nav>
        
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Product Image */}
          <div className="mb-8 lg:mb-0">
            <div className="bg-gray-50 rounded-lg overflow-hidden">
              <img 
                src={backendURl + product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          
          {/* Product Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <span className="text-2xl font-bold text-gray-900">₹{product.price.toFixed(2)}</span>
              {product.customizable && (
                <span className="ml-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                  Customizable
                </span>
              )}
            </div>
            
            <p className="text-gray-700 mb-6">{product.description}</p>
            
            {/* Product details */}
            <div className="border-t border-b border-gray-200 py-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{product.category}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Materials</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.materials.join(', ')}
                  </p>
                </div>
                
                {product.dimensions && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Dimensions</h3>
                    <p className="mt-1 text-sm text-gray-900">
                      {product.dimensions.width} × {product.dimensions.height} × {product.dimensions.depth} {product.dimensions.unit}
                    </p>
                  </div>
                )}
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Availability</h3>
                  <p className={`mt-1 text-sm ${product.isAvailable ? 'text-green-600' : 'text-red-600'}`}>
                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Customization options */}
            {product.customizable && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customization Options</h3>
                
                {product.category === 'frame' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frame Color
                      </label>
                      <div className="flex space-x-2">
                        {['Natural', 'Walnut', 'Black', 'White'].map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedCustomizations({...selectedCustomizations, color})}
                            className={`w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                              selectedCustomizations.color === color ? 'ring-2 ring-rose-500' : ''
                            }`}
                            style={{ 
                              backgroundColor: 
                                color === 'Natural' ? '#D4B895' : 
                                color === 'Walnut' ? '#5D4037' : 
                                color === 'Black' ? '#212121' : 
                                '#FFFFFF',
                              border: color === 'White' ? '1px solid #E0E0E0' : 'none'
                            }}
                            aria-label={color}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['4×6"', '5×7"', '8×10"', '11×14"'].map(size => (
                          <button
                            key={size}
                            onClick={() => setSelectedCustomizations({...selectedCustomizations, size})}
                            className={`px-4 py-2 border rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                              selectedCustomizations.size === size 
                                ? 'bg-rose-600 border-rose-600 text-white' 
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                            }`}
                          >
                            {size}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                
                {product.category === 'gift' && (
                  <div className="mb-4">
                    <label htmlFor="engraving" className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Engraving
                    </label>
                    <input
                      type="text"
                      id="engraving"
                      value={selectedCustomizations.engraving || ''}
                      onChange={(e) => setSelectedCustomizations({...selectedCustomizations, engraving: e.target.value})}
                      placeholder="Enter text for engraving"
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Maximum 20 characters
                    </p>
                  </div>
                )}
              </div>
            )}
            
            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="w-full sm:w-1/3">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <select
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-rose-500 focus:border-rose-500 sm:text-sm"
                  disabled={!product.isAvailable}
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="w-full sm:w-2/3 flex space-x-2">
                <button
                  onClick={handleAddToCart}
                  disabled={!product.isAvailable}
                  className={`flex-1 flex items-center justify-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                    product.isAvailable 
                      ? 'bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {addedToCart ? (
                    <>
                      <Check className="mr-2 h-5 w-5" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      Add to Cart
                    </>
                  )}
                </button>
                
                <button
                  className="p-3 border border-gray-300 rounded-md text-gray-400 hover:text-rose-500 hover:border-rose-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  aria-label="Add to favorites"
                >
                  <Heart className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard key={relatedProduct._id} product={relatedProduct} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;