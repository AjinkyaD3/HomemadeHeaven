import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['frame', 'gift', 'gift-hamper', 'bracelet', 'phoneCase'],
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    customizable: {
        type: Boolean,
        default: false,
    },
    materials: [{
        type: String,
    }],
    dimensions: {
        width: Number,
        height: Number,
        depth: Number,
        unit: {
            type: String,
            enum: ['cm', 'in'],
        },
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const Product = mongoose.model('Product', productSchema);

export default Product; 