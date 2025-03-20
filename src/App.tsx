import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ProductFormPage from './pages/admin/ProductFormPage';

// Lazy-loaded pages
const HomePage = React.lazy(() => import('./pages/HomePage'));
const ShopPage = React.lazy(() => import('./pages/ShopPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const CheckoutPage = React.lazy(() => import('./pages/CheckoutPage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const ProfilePage = React.lazy(() => import('./pages/account/ProfilePage'));
const OrdersPage = React.lazy(() => import('./pages/account/OrdersPage'));
const FavoritesPage = React.lazy(() => import('./pages/account/FavoritesPage'));
const CustomOrderPage = React.lazy(() => import('./pages/CustomOrderPage'));
const AboutPage = React.lazy(() => import('./pages/AboutPage'));
const AdminDashboard = React.lazy(() => import('./pages/admin/DashboardPage'));
const AdminProducts = React.lazy(() => import('./pages/admin/ProductsPage'));
const AdminOrders = React.lazy(() => import('./pages/admin/OrdersPage'));
const AdminOrderDetail = React.lazy(() => import('./pages/admin/OrderDetailPage'));

// Wrapper component to handle conditional navbar rendering
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route 
              path="/checkout" 
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/account/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account/favorites" 
              element={
                <ProtectedRoute>
                  <FavoritesPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/account/orders" 
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/custom-order" 
              element={
                <ProtectedRoute>
                  <CustomOrderPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/products" 
              element={
                <AdminRoute>
                  <AdminProducts />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/products/new" 
              element={
                <AdminRoute>
                  <ProductFormPage /> 
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/orders" 
              element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/orders/:id" 
              element={
                <AdminRoute>
                  <AdminOrderDetail />
                </AdminRoute>
              } 
            />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <FavoritesProvider>
            <CartProvider>
              <AppContent />
              <Toaster position="top-right" />
            </CartProvider>
          </FavoritesProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
}

export default App;