import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' });
    }
};

export default function (req, res, next) {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log('Received token:', token);

        // Check if no token
        if (!token) {
            console.log('No token provided');
            return res.status(401).json({ message: 'No token, authorization denied' });
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Decoded token:', decoded);

        if (!decoded || !decoded.userId) {
            console.log('Invalid token payload:', decoded);
            return res.status(401).json({ message: 'Invalid token payload' });
        }

        // Add user info to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role || 'customer'
        };
        console.log('Set user info:', req.user);
        next();
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
}