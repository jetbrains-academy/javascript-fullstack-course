import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { userService } from '../data/dataServices.js';

// Validate JWT secret configuration
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;
console.log(`JWT_SECRET == ${process.env.JWT_SECRET}`);

if (!JWT_SECRET || JWT_SECRET === 'your-super-secret-key-change-in-production' || JWT_SECRET.length < 32) {
  console.error('WARNING: JWT_SECRET is not properly configured. Use scripts/generate-secret.js to generate a secure secret.');
  if (process.env.NODE_ENV === 'production') {
    throw new Error('JWT_SECRET must be properly configured in production');
  }
}

export const generateToken = (username) => {
  return jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
};

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Authentication token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUser(decoded.username);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authenticateSocket = async (socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error('Authentication token required'));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await userService.getUser(decoded.username);

    if (!user) {
      return next(new Error('User not found'));
    }

    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Invalid token'));
  }
};
