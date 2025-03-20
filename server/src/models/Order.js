import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true,
        },
    }],
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'],
        default: 'pending',
    },
    total: {
        type: Number,
        required: true,
    },
    subtotal: {
        type: Number,
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    shipping: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    couponCode: String,
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'netbanking', 'wallet', 'upi', 'cod', 'razorpay'],
        required: true,
    },
    paymentId: String,
    razorpayOrderId: String,
    razorpayPaymentId: String,
    razorpaySignature: String,
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
    },
    billingAddress: {
        street: String,
        city: String,
        state: String,
        pincode: String,
        phone: String,
    },
    trackingNumber: String,
    trackingUrl: String,
    notes: String,
    statusHistory: [{
        status: {
            type: String,
            enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'canceled', 'refunded'],
        },
        timestamp: {
            type: Date,
            default: Date.now,
        },
        note: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    }],
}, {
    timestamps: true,
});

// Add status to history when order status changes
orderSchema.pre('save', function (next) {
    if (this.isModified('status')) {
        this.statusHistory.push({
            status: this.status,
            timestamp: new Date(),
            updatedBy: this.user,
        });
    }
    next();
});

// Calculate total before saving
orderSchema.pre('save', function (next) {
    this.total = this.subtotal + this.tax + this.shipping - this.discount;
    next();
});

const Order = mongoose.model('Order', orderSchema);

export default Order;