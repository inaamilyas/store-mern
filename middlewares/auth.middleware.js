import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'kdjfsafajfddasjfas';

export function authorizeRoles(allowedRoles = []) {
  return async (req, res, next) => {
    try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res
        .status(401)
        .json({ message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    console.log('inside auth JWT', JWT_SECRET);

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId);
    if (!user) return res.status(401).json({ message: 'User not found' });

    // Allow all access to admin
    if (user.role === 'admin' || allowedRoles.includes(user.role)) {
      req.user = user;
      return next();
    }

    return res
      .status(403)
      .json({ message: 'Access denied: insufficient permissions' });
    } catch (err) {
      console.error('JWT validation error:', err);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  };
}
