import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing' });
    try {
        if (!process.env.JWT_SECRET) {
            console.error('CRITICAL: JWT_SECRET is not defined');
            return res.status(500).json({ message: 'An internal server error occurred.' });
        }
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    }
    catch (err) {
        console.error('Token verification error:', err);
        return res.status(403).json({ message: 'Invalid token', error: err.message });
    }
};

export const requireAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied: Admin role required' });
    }
    next();
};