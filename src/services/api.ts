import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Add auth token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const api = {
  // Auth endpoints
  register: async (email: string, password: string, fullName: string) => {
    const response = await axios.post(`${BASE_URL}/auth/register`, { email, password, fullName });
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/auth/verify/${token}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${BASE_URL}/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${BASE_URL}/auth/reset-password`, { token, newPassword });
    return response.data;
  },

  validateToken: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // HTTP Methods
  get: async (endpoint: string) => {
    const response = await axios.get(`${BASE_URL}${endpoint}`);
    return response.data;
  },

  post: async (endpoint: string, data: any) => {
    const response = await axios.post(`${BASE_URL}${endpoint}`, data);
    return response.data;
  },

  put: async (endpoint: string, data: any) => {
    const response = await axios.put(`${BASE_URL}${endpoint}`, data);
    return response.data;
  },

  patch: async (endpoint: string, data: any) => {
    const response = await axios.patch(`${BASE_URL}${endpoint}`, data);
    return response.data;
  },

  delete: async (endpoint: string) => {
    const response = await axios.delete(`${BASE_URL}${endpoint}`);
    return response.data;
  },

  // Favorites API methods
  getFavorites: async () => {
    return api.get('/users/favorites');
  },

  toggleFavorite: async (productId: string) => {
    return api.post(`/users/favorites/${productId}`);
  },

  getFavoriteProducts: async () => {
    return api.get('/users/favorites/products');
  },

  // Product API methods
  getProducts: async () => {
    return api.get('/products');
  },

  getProduct: async (id: string) => {
    return api.get(`/products/${id}`);
  },

  // Admin API methods
  createProduct: async (productData: FormData) => {
    return api.post('/admin/products', productData);
  },

  updateProduct: async (id: string, productData: FormData) => {
    return api.put(`/admin/products/${id}`, productData);
  },

  deleteProduct: async (id: string) => {
    return api.delete(`/admin/products/${id}`);
  },

  // Order endpoints
  createOrder: async (orderData: any) => {
    return api.post('/orders', orderData);
  },

  verifyPayment: async (paymentData: any) => {
    return api.post('/orders/verify-payment', paymentData);
  },

  getUserOrders: async () => {
    return api.get('/orders/user');
  },

  getAllOrders: async () => {
    return api.get('/orders/admin');
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return api.patch(`/orders/${orderId}/status`, { status });
  },

  // Cart API methods
  addToCart: async (productId: string, quantity: number) => {
    return api.post('/cart', { productId, quantity });
  },

  logout: async () => {
    // Clear the token from localStorage
    localStorage.removeItem('token');
    return { success: true };
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },
};