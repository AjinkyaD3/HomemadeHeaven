import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user's favorite product IDs
router.get('/users/favorites', auth, async (req, res) => {
    try {
        console.log('Fetching favorites for user:', req.user.id);
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Found user favorites:', user.favorites || []);
        res.json({ favorites: user.favorites || [] });
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Server error while fetching favorites' });
    }
});

// Get user's favorite products with full details
router.get('/users/favorites/products', auth, async (req, res) => {
    try {
        console.log('Fetching favorite products for user:', req.user.id);
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        const products = await Product.find({ _id: { $in: user.favorites || [] } });
        console.log('Found favorite products:', products.length);
        res.json(products);
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        res.status(500).json({ message: 'Server error while fetching favorite products' });
    }
});

// Toggle favorite status for a product
router.post('/users/favorites/:productId', auth, async (req, res) => {
    try {
        console.log('Toggling favorite for user:', req.user.id, 'product:', req.params.productId);
        const user = await User.findById(req.user.id);

        if (!user) {
            console.log('User not found:', req.user.id);
            return res.status(404).json({ message: 'User not found' });
        }

        const productId = req.params.productId;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            console.log('Product not found:', productId);
            return res.status(404).json({ message: 'Product not found' });
        }

        const isFavorite = user.favorites && user.favorites.includes(productId);
        if (isFavorite) {
            // Remove from favorites
            user.favorites = user.favorites.filter(id => id.toString() !== productId);
            console.log('Removed product from favorites');
        } else {
            // Add to favorites
            if (!user.favorites) {
                user.favorites = [];
            }
            user.favorites.push(productId);
            console.log('Added product to favorites');
        }

        await user.save();
        res.json({ isFavorite: !isFavorite });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ message: 'Server error while toggling favorite' });
    }
});

export default router; 