import express from 'express';
import auth from '../middleware/auth.js';
import admin from '../middleware/admin.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Initialize Razorpay only if credentials are available
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
}

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
        let query = { userId: req.user.id };

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

        console.log('Query:', query);
        const orders = await Order.find(query)
            .populate('items.product')
            .sort(sortObj || { createdAt: -1 });

        console.log('Found orders:', orders);
        res.json(orders);
    } catch (error) {
        console.error('Error fetching user orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// Create order and initiate payment
router.post('/create', auth, async (req, res) => {
    try {
        const { items, subtotal, tax, shipping, discount, shippingAddress, billingAddress, paymentMethod } = req.body;
        console.log('Received order creation request:', req.body);

        // Check if Razorpay is configured
        if (!razorpay) {
            console.error('Razorpay not configured. Missing credentials.');
            return res.status(503).json({
                message: 'Payment service is not configured. Please contact support.'
            });
        }

        // Validate required fields
        if (!items || !Array.isArray(items) || items.length === 0) {
            console.error('Missing or invalid items:', items);
            return res.status(400).json({
                message: 'Missing or invalid items'
            });
        }

        // Validate products and check stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({
                    message: `Product ${item.product} not found`
                });
            }
            if (!product.isAvailable) {
                return res.status(400).json({
                    message: `Product ${product.name} is not available`
                });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({
                    message: `Not enough stock for ${product.name}. Available: ${product.stock}`
                });
            }
        }

        // Calculate total
        const total = subtotal + (tax || 0) + (shipping || 0) - (discount || 0);

        // Create order in database
        const order = new Order({
            userId: req.user.userId,
            items: items.map(item => ({
                product: item.product,
                quantity: item.quantity,
                price: item.price
            })),
            subtotal,
            tax: tax || 0,
            shipping: shipping || 0,
            discount: discount || 0,
            total,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentStatus: 'pending',
            paymentMethod,
            status: 'pending'
        });

        console.log('Saving order to database:', order);
        await order.save();

        try {
            // Create Razorpay order
            const razorpayOrder = await razorpay.orders.create({
                amount: Math.round(total * 100), // Amount in paise
                currency: 'INR',
                receipt: order._id.toString(),
                payment_capture: 1
            });

            console.log('Created Razorpay order:', razorpayOrder);

            // Update order with Razorpay order ID
            order.razorpayOrderId = razorpayOrder.id;
            await order.save();

            // Populate order details
            const populatedOrder = await Order.findById(order._id)
                .populate('items.product')
                .populate('userId', 'email fullName');

            res.status(201).json({
                order: populatedOrder,
                razorpayOrderId: razorpayOrder.id,
                key: process.env.RAZORPAY_KEY_ID
            });
        } catch (razorpayError) {
            console.error('Razorpay order creation failed:', razorpayError);
            // Delete the order from database if Razorpay order creation fails
            await Order.findByIdAndDelete(order._id);
            throw razorpayError;
        }
    } catch (error) {
        console.error('Error in order creation:', error);
        res.status(500).json({
            message: 'Error creating order',
            error: error.message
        });
    }
});

// Verify payment
router.post('/verify-payment', auth, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
        console.log('Received payment verification request:', { razorpayOrderId, razorpayPaymentId, razorpaySignature });

        // Validate required fields
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            console.error('Missing required fields:', { razorpayOrderId, razorpayPaymentId, razorpaySignature });
            return res.status(400).json({
                message: 'Missing required fields: razorpayOrderId, razorpayPaymentId, or razorpaySignature'
            });
        }

        // Verify signature
        const secret = process.env.RAZORPAY_KEY_SECRET;
        const generated_signature = crypto
            .createHmac('sha256', secret)
            .update(razorpayOrderId + '|' + razorpayPaymentId)
            .digest('hex');

        console.log('Generated signature:', generated_signature);
        console.log('Received signature:', razorpaySignature);

        if (generated_signature !== razorpaySignature) {
            console.error('Invalid payment signature');
            return res.status(400).json({ message: 'Invalid payment signature' });
        }

        const order = await Order.findOne({ razorpayOrderId });
        if (!order) {
            console.error('Order not found for razorpayOrderId:', razorpayOrderId);
            return res.status(404).json({ message: 'Order not found' });
        }

        // Update order status
        order.paymentStatus = 'paid';
        order.razorpayPaymentId = razorpayPaymentId;
        order.razorpaySignature = razorpaySignature;
        order.status = 'confirmed';

        await order.save();

        // Update product stock
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        res.json({ message: 'Payment verified successfully', order });
    } catch (error) {
        console.error('Payment verification error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Admin routes
router.get('/', [auth, admin], async (req, res) => {
    try {
        const { status, paymentStatus, sort, startDate, endDate, search } = req.query;
        let query = {};

        // Apply filters
        if (status) query.status = status;
        if (paymentStatus) query.paymentStatus = paymentStatus;

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
                { userId: { $in: userIds } },
                { 'shippingAddress.street': { $regex: search, $options: 'i' } },
                { 'shippingAddress.city': { $regex: search, $options: 'i' } }
            ];
        }

        // Build sort object
        let sortObj = {};
        if (sort === 'date_asc') sortObj.createdAt = 1;
        if (sort === 'date_desc') sortObj.createdAt = -1;
        if (sort === 'amount_asc') sortObj.total = 1;
        if (sort === 'amount_desc') sortObj.total = -1;

        const orders = await Order.find(query)
            .populate('userId', 'email fullName')
            .populate('items.product')
            .sort(sortObj || { createdAt: -1 });

        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Server error while fetching orders' });
    }
});

// Update order status (Admin only)
router.put('/:id/status', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        console.log('Updating order status:', { orderId: req.params.id, newStatus: status });

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Define valid statuses and transitions
        const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
                currentStatus: order.status,
                requestedStatus: status
            });
        }

        // Validate status transition
        const validTransitions = {
            pending: ['confirmed', 'canceled'],
            confirmed: ['processing', 'canceled'],
            processing: ['shipped', 'canceled'],
            shipped: ['delivered', 'canceled'],
            delivered: ['refunded'],
            canceled: ['confirmed'],
            refunded: []
        };

        if (!validTransitions[order.status]?.includes(status)) {
            return res.status(400).json({
                message: `Invalid status transition from ${order.status} to ${status}. Valid transitions are: ${validTransitions[order.status]?.join(', ')}`,
                currentStatus: order.status,
                requestedStatus: status,
                validTransitions: validTransitions[order.status]
            });
        }

        // Handle stock updates based on status change
        if (status === 'canceled' && order.status !== 'canceled') {
            // Restore stock
            for (const item of order.items) {
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: item.quantity }
                });
            }
        } else if (order.status === 'canceled' && status !== 'canceled') {
            // Check and deduct stock
            for (const item of order.items) {
                const product = await Product.findById(item.product);
                if (!product || product.stock < item.quantity) {
                    return res.status(400).json({
                        message: `Not enough stock for product: ${product ? product.name : 'Unknown'}`
                    });
                }
                await Product.findByIdAndUpdate(item.product, {
                    $inc: { stock: -item.quantity }
                });
            }
        }

        // Update order status
        order.status = status;
        if (req.body.note) {
            order.statusHistory.push({
                status,
                note: req.body.note,
                updatedBy: req.user.userId
            });
        }

        await order.save();

        const updatedOrder = await Order.findById(order._id)
            .populate('userId', 'email fullName')
            .populate('items.product');

        res.json(updatedOrder);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Server error while updating order status' });
    }
});

// Get single order
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('userId', 'email fullName')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user is admin or order belongs to user
        if (!req.user.isAdmin && order.userId._id.toString() !== req.user.userId.toString()) {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router; 