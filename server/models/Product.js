const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    image: {
        type: String,
        required: [true, 'Product image is required']
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Product stock is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    customizable: {
        type: Boolean,
        default: false
    },
    rating: {
        type: Number,
        default: 0,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot exceed 5']
    },
    numReviews: {
        type: Number,
        default: 0,
        min: [0, 'Number of reviews cannot be negative']
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual for checking if product is in stock
productSchema.virtual('inStock').get(function () {
    return this.stock > 0;
});

// Pre-save middleware to update isAvailable based on stock
productSchema.pre('save', function (next) {
    this.isAvailable = this.stock > 0;
    next();
});

// Method to update product rating
productSchema.methods.updateRating = async function (rating) {
    this.rating = ((this.rating * this.numReviews) + rating) / (this.numReviews + 1);
    this.numReviews += 1;
    return this.save();
};

module.exports = mongoose.model('Product', productSchema);
