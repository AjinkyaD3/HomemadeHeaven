import User from '../models/User.js';

export default async function (req, res, next) {
    try {
        if (!req.user || !req.user.userId) {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const user = await User.findById(req.user.userId);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        res.status(500).json({ message: 'Server error while checking admin access' });
    }
}