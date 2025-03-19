import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext';
import { api } from '../../services/api';
import { Heart, ShoppingCart } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  likes: number;
}

const FavoritesPage: React.FC = () => {
  const { user } = useAuth();
  const { favorites, removeFromFavorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavoriteProducts = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const response = await api.getFavoriteProducts();
        setProducts(response);
      } catch (error) {
        console.error('Error fetching favorite products:', error);
        toast.error('Failed to load favorite products');
      } finally {
        setLoading(false);
      }
    };

    fetchFavoriteProducts();
  }, [user]);

  const handleAddToCart = async (productId: string) => {
    try {
      await api.addToCart(productId, 1);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleToggleFavorite = async (productId: string) => {
    try {
      await removeFromFavorites(productId);
      setProducts(products.filter(product => product._id !== productId));
      toast.success('Removed from favorites');
    } catch (error) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Please Log In</h2>
              <p className="text-gray-600 mb-4">
                You need to be logged in to view your favorites.
              </p>
              <Button onClick={() => navigate('/login')}>
                Log In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <Heart className="mx-auto h-12 w-12 text-gray-400" />
              <h2 className="mt-2 text-lg font-medium text-gray-900">No favorites yet</h2>
              <p className="mt-1 text-sm text-gray-500">
                You haven't added any products to your favorites.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/shop')}>
                  Browse Products
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Your Favorites</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <Card key={product._id} className="group">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => handleToggleFavorite(product._id)}
              >
                <Heart className="h-5 w-5 text-red-500 fill-current" />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold">₹{product.price.toFixed(2)}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => handleAddToCart(product._id)}
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;