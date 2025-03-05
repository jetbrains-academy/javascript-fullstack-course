import express from 'express';
import bcrypt from 'bcryptjs';
import { userService } from '../data/index.js';
import { generateToken } from '../middleware/auth.js';

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    console.log('Registration request received:', req.body);
    const { username, password } = req.body;

    if (!username || !password) {
      console.log('Registration failed: missing username or password');
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    console.log('Attempting to create user:', { username });
    const user = userService.createUser(username, hashedPassword);
    console.log('User created successfully:', user);

    // Generate token
    const token = generateToken(username);
    console.log('Token generated successfully');

    res.status(201).json({ token, username: user.username });
  } catch (error) {
    console.error('Registration error:', error);
    if (error.message === 'Username already exists') {
      return res.status(409).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating user: ' + error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = userService.getUser(username);

    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Compare password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    // Generate token
    const token = generateToken(username);

    res.json({ token, username: user.username });
  } catch (error) {
    res.status(500).json({ message: 'Error during login' });
  }
});

export default router;
