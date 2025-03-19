import express from 'express';
import auth from '../middleware/auth.js';
import User from '../models/User.js';
import Favorite from '../models/Favorite.js';
import Product from '../models/Product.js';

const router = express.Router();

// Get user favorites (IDs only)
router.get('/favorites', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.userId })
            .populate('productId', 'name price description images');
        res.json(favorites);
    } catch (error) {
        console.error('Error fetching favorites:', error);
        res.status(500).json({ message: 'Error fetching favorites' });
    }
});

// Get favorite products (full product details)
router.get('/favorites/products', auth, async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user.userId });
        const productIds = favorites.map(fav => fav.productId);
        
        const products = await Product.find({ _id: { $in: productIds } });
        res.json(products);
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        res.status(500).json({ message: 'Error fetching favorite products' });
    }
});

// Toggle favorite
router.post('/favorites/:productId', auth, async (req, res) => {
    try {
        const { productId } = req.params;
        const userId = req.user.userId;

        const existingFavorite = await Favorite.findOne({ userId, productId });

        if (existingFavorite) {
            await Favorite.deleteOne({ _id: existingFavorite._id });
            res.json({ message: 'Removed from favorites', status: 'removed' });
        } else {
            const newFavorite = new Favorite({ userId, productId });
            await newFavorite.save();
            res.json({ message: 'Added to favorites', status: 'added' });
        }
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({ message: 'Error toggling favorite' });
    }
});

export default router;
