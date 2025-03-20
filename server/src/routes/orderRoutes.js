import express from 'express';
import Order from '../models/Order.js';
import { auth } from '../middleware/auth.js';
import { admin } from '../middleware/admin.js';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

const RAZORPAY_KEY_ID = "rzp_test_UUYHj33lYz4HOl"
const RAZORPAY_KEY_SECRET = "Gaq8kVcgQRRouFm5UCZFdrQM"
// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: RAZORPAY_KEY_ID,
    key_secret: RAZORPAY_KEY_SECRET
});

// Create order and initiate payment
router.post('/create', auth, async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress } = req.body;

        // Create Razorpay order
        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100, // Convert to paise
            currency: 'INR',
            receipt: 'receipt_' + Math.random().toString(36).substring(7),
        });

        // Create order in database
        const order = new Order({
            userId: req.user._id,
            items,
            total: totalAmount,
            subtotal: totalAmount,
            tax: 0,
            shipping: 0,
            shippingAddress: deliveryAddress,
            billingAddress: deliveryAddress,
            paymentStatus: 'pending',
            paymentMethod: 'card',
            razorpayOrderId: razorpayOrder.id,
        });

        await order.save();

        res.json({
            orderId: order._id,
            razorpayOrderId: razorpayOrder.id,
            amount: totalAmount * 100,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Error creating order' });
    }
});

// Verify payment
router.post('/verify-payment', auth, async (req, res) => {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Verify signature
        const sign = razorpayOrderId + "|" + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(sign)
            .digest("hex");

        if (razorpaySignature !== expectedSign) {
            return res.status(400).json({ message: "Invalid payment signature" });
        }

        // Update order status
        await Order.findOneAndUpdate(
            { razorpayOrderId },
            {
                paymentStatus: 'paid',
                status: 'confirmed',
                razorpayPaymentId
            }
        );

        res.json({ message: "Payment verified successfully" });
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Error verifying payment' });
    }
});

// Get user's orders
router.get('/my-orders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id })
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Admin: Get all orders
router.get('/admin/all', [auth, admin], async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('userId', 'email fullName')
            .populate('items.product')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error('Error fetching admin orders:', error);
        res.status(500).json({ message: 'Error fetching orders' });
    }
});

// Admin: Update order status
router.patch('/admin/status/:orderId', [auth, admin], async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.orderId,
            { status },
            { new: true }
        ).populate('userId', 'email fullName')
            .populate('items.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error updating order status:', error);
        res.status(500).json({ message: 'Error updating order status' });
    }
});

export default router;
