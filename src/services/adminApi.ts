import { api } from './api';

export interface DashboardStats {
    totalRevenue: number;
    totalOrders: number;
    totalCustomers: number;
    totalProducts: number;
    revenueChange: number;
    ordersChange: number;
    customersChange: number;
    productsChange: number;
}

export const adminApi = {
    getDashboardStats: async (): Promise<DashboardStats> => {
        const [orders, products] = await Promise.all([
            api.get('/orders'),
            api.get('/products')
        ]);

        // Calculate stats
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + order.total, 0);
        const totalOrders = orders.length;
        const totalProducts = products.length;

        // For now, using static values for changes
        // TODO: Implement actual calculation based on previous period
        return {
            totalRevenue,
            totalOrders,
            totalCustomers: 0, // Will be updated when customer count endpoint is available
            totalProducts,
            revenueChange: 12,
            ordersChange: 8,
            customersChange: 15,
            productsChange: 5
        };
    },

    getOrdersByStatus: async () => {
        const orders = await api.get('/orders');
        const statusCounts = orders.reduce((acc: any, order: any) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(statusCounts).map(([status, count]) => ({
            status,
            count
        }));
    },

    getRecentOrders: async () => {
        const orders = await api.get('/orders');
        return orders
            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5);
    },

    getRevenueData: async () => {
        const orders = await api.get('/orders');
        // Group orders by date and calculate daily revenue
        const dailyRevenue = orders.reduce((acc: any, order: any) => {
            const date = new Date(order.createdAt).toLocaleDateString();
            acc[date] = (acc[date] || 0) + order.total;
            return acc;
        }, {});

        // Get last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toLocaleDateString();
            return {
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                revenue: dailyRevenue[dateStr] || 0
            };
        }).reverse();

        return last7Days;
    }
}; 