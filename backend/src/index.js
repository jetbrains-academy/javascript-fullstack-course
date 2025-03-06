import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIO } from 'socket.io';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/messages.js';
import { authenticateToken } from './middleware/auth.js';
import { initializeSocketIO } from './socket.js';



const app = express();
const httpServer = createServer(app);
const io = new SocketIO(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

// Middleware
//app.use(cors());
app.use(express.json());

// Request/Response logging middleware
app.use((req, res, next) => {
  const requestId = Date.now().toString();
  console.log(`[${new Date().toISOString()}] (${requestId}) ${req.method} ${req.url}`);

  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`(${requestId}) Request body:`, {
      ...req.body
    });
  }

  // Capture response
  const originalJson = res.json;
  res.json = function(data) {
    console.log(`(${requestId}) Response:`, {
      status: res.statusCode,
      body: data
    });
    return originalJson.call(this, data);
  };

  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', authenticateToken, messageRoutes);
// app.use('/api/messages', messageRoutes);

app.get('/api/calculate', (req, res) => {
  const a = parseFloat(req.query.a); // Get 'a' from query parameters
  const b = parseFloat(req.query.b); // Get 'b' from query parameters

  // Check if either 'a' or 'b' is missing or not a valid number
  if (isNaN(a) || isNaN(b)) {
    return res.status(400).json({ message: 'Invalid query parameters. Ensure "a" and "b" are numbers.' });
  }

  const sum = a + b; // Calculate the sum
  res.json({ sum }); // Return the sum as a response
});


// Socket.IO setup
initializeSocketIO(io);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export { app, io };
