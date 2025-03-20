import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Add request interceptor to include token in all requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Making request to:', config.url);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Response error:', error);
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || 'An error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An error occurred. Please try again.');
    }
  }
);

export const api = {
  // Auth endpoints
  register: async (email: string, password: string, fullName: string) => {
    try {
      console.log('Making registration request to:', `${BASE_URL}/api/auth/register`);
      const response = await axios.post(`${BASE_URL}/api/auth/register`, { email, password, fullName });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      console.log('Making login request to:', `${BASE_URL}/api/auth/login`);
      const response = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    const response = await axios.get(`${BASE_URL}/api/auth/me`);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/api/auth/verify/${token}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await axios.post(`${BASE_URL}/api/auth/forgot-password`, { email });
    return response.data;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await axios.post(`${BASE_URL}/api/auth/reset-password`, { token, newPassword });
    return response.data;
  },

  validateToken: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/api/auth/validate`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // HTTP Methods
  get: async (endpoint: string) => {
    const response = await axios.get(`${BASE_URL}/api${endpoint}`);
    return response.data;
  },

  post: async (endpoint: string, data: any) => {
    const response = await axios.post(`${BASE_URL}/api${endpoint}`, data);
    return response.data;
  },

  put: async (endpoint: string, data: any) => {
    const response = await axios.put(`${BASE_URL}/api${endpoint}`, data);
    return response.data;
  },

  patch: async (endpoint: string, data: any) => {
    const response = await axios.patch(`${BASE_URL}/api${endpoint}`, data);
    return response.data;
  },

  delete: async (endpoint: string) => {
    const response = await axios.delete(`${BASE_URL}/api${endpoint}`);
    return response.data;
  },

  // Favorites API methods
  getFavorites: async () => {
    return api.get('/users/favorites');
  },

  toggleFavorite: async (productId: string) => {
    return api.post(`/users/favorites/${productId}`, { productId });
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
    return api.post('/orders/create', orderData);
  },

  verifyPayment: async (paymentData: any) => {
    return api.post('/orders/verify-payment', paymentData);
  },

  getUserOrders: async () => {
    return api.get('/orders/my-orders');
  },

  getAllOrders: async () => {
    return api.get('/orders');
  },

  getOrderById: async (orderId: string) => {
    return api.get(`/orders/${orderId}`);
  },

  updateOrderStatus: async (orderId: string, status: string) => {
    return api.put(`/orders/${orderId}/status`, { status });
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
};