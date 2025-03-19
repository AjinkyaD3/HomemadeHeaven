import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

const router = express.Router();

// User routes
router.post('/', auth, async (req, res) => {
    try {
        const { items, deliveryAddress, paymentMethod, notes } = req.body;

        // Calculate total amount and validate products
        let totalAmount = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.product} not found` });
            }
            if (!product.isAvailable) {
                return res.status(400).json({ message: `Product ${product.name} is not available` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Not enough stock for ${product.name}` });
            }
            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            user: req.user.id,
            items,
            totalAmount,
            deliveryAddress,
            paymentMethod,
            notes,
        });

        await order.save();

        // Update product stock
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Populate the response with product details
        const populatedOrder = await Order.findById(order._id)
            .populate('items.product')
            .populate('user', 'email fullName');

        res.status(201).json(populatedOrder);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    }
});

router.get('/my-orders', auth, async (req, res) => {
    try {
        const { status, sort, startDate, endDate } = req.query;
        let query = { user: req.user.id };

        // Apply status filter
        if (status) {
            query.status = status;
        }

        // Apply date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Build sort object
        let sortObj = {};
        if (sort === 'date_asc') sortObj.createdAt = 1;
        if (sort === 'date_desc') sortObj.createdAt = -1;
        if (sort === 'amount_asc') sortObj.totalAmount = 1;
        if (sort === 'amount_desc') sortObj.totalAmount = -1;

        const orders = await Order.find(query)
            .populate('items.product')
            .sort(sortObj || { createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// Admin routes
router.get('/', [auth, admin], async (req, res) => {
    try {
        const { status, sort, startDate, endDate, search } = req.query;
        let query = {};

        // Apply status filter
        if (status) {
            query.status = status;
        }

        // Apply date range filter
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Apply search filter
        if (search) {
            const users = await User.find({
                $or: [
                    { email: { $regex: search, $options: 'i' } },
                    { fullName: { $regex: search, $options: 'i' } }
                ]
            });
            const userIds = users.map(user => user._id);
            query.$or = [
                { user: { $in: userIds } },
                { 'deliveryAddress.street': { $regex: search, $options: 'i' } },
                { 'deliveryAddress.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortObj = {};
        if (sort === 'date_asc') sortObj.createdAt = 1;
        if (sort === 'date_desc') sortObj.createdAt = -1;
        if (sort === 'amount_asc') sortObj.totalAmount = 1;
        if (sort === 'amount_desc') sortObj.totalAmount = -1;

        const orders = await Order.find(query)
            .populate('user', 'email fullName')
            .populate('items.product')
            .sort(sortObj || { createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

router.put('/:id/status', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;

        // Validate status
        const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // If order is being cancelled and wasn't cancelled before
        if (status === 'cancelled' && order.status !== 'cancelled') {
            // Restore product stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        }
        // If order was cancelled and is being un-cancelled
        else if (order.status === 'cancelled' && status !== 'cancelled') {
            // Validate stock before un-cancelling
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock to un-cancel order for product: ${product ? product.name : 'Unknown'}`
                    });
                }
            }
            // Deduct stock again
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('user', 'email fullName')
            .populate('items.product');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error while updating order status' });
    }
});

export default router; 