import { api } from './api';

export interface OrderItem {
    product: string;
    quantity: number;
    price: number;
}

export interface DeliveryAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
}

export interface Order {
    _id: string;
    items: OrderItem[];
    totalAmount: number;
    status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
    deliveryAddress: DeliveryAddress;
    paymentStatus: 'pending' | 'completed' | 'failed';
    paymentMethod: 'cash' | 'card';
    createdAt: string;
    updatedAt: string;
}

export const orderService = {
    createOrder: async (items: OrderItem[], totalAmount: number, deliveryAddress: DeliveryAddress) => {
        const response = await api.post('/orders/create', {
            items,
            totalAmount,
            deliveryAddress
        });
        return response.data;
    },

    verifyPayment: async (razorpayOrderId: string, razorpayPaymentId: string, razorpaySignature: string) => {
        const response = await api.post('/orders/verify-payment', {
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature
        });
        return response.data;
    },

    getMyOrders: async () => {
        const response = await api.get('/orders/my-orders');
        return response.data;
    },

    // Admin functions
    getAllOrders: async () => {
        const response = await api.get('/orders/admin/all');
        return response.data;
    },

    updateOrderStatus: async (orderId: string, status: Order['status']) => {
        const response = await api.patch(`/orders/admin/status/${orderId}`, { status });
        return response.data;
    }
};
