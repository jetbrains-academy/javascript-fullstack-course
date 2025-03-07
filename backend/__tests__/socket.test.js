import { createServer } from 'http';
import { Server } from 'socket.io';
import Client from 'socket.io-client';
import { app } from '../src/index.js';
import { initializeSocketIO } from '../src/socket.js';
import { userService, messageService } from '../src/data/dataServices.js';
import { generateToken } from '../src/middleware/auth.js';

describe('Socket.IO Chat', () => {
  let io, serverSocket, clientSocket, httpServer;
  const testUser = {
    username: 'testuser',
    password: 'password123'
  };
  let authToken;

  beforeAll((done) => {
    httpServer = createServer(app);
    io = new Server(httpServer);
    initializeSocketIO(io);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`, {
        auth: {
          token: null // Will be set in beforeEach
        }
      });
      done();
    });
  });

  beforeEach((done) => {
    // Clear data
    userService.users.clear();
    messageService.messages = [];

    // Create test user and generate token
    userService.createUser(testUser.username, testUser.password);
    authToken = generateToken(testUser.username);

    // Update client socket auth token
    clientSocket.auth = { token: authToken };
    
    // Wait for connection
    clientSocket.on('connect', done);
    clientSocket.connect();
  });

  afterEach(() => {
    clientSocket.disconnect();
  });

  afterAll(() => {
    io.close();
    httpServer.close();
  });

  test('should authenticate with valid token', (done) => {
    clientSocket.on('connect', () => {
      expect(clientSocket.connected).toBe(true);
      done();
    });
  });

  test('should broadcast messages to all clients', (done) => {
    const testMessage = { content: 'Hello, WebSocket!' };

    clientSocket.on('message', (message) => {
      expect(message).toHaveProperty('content', testMessage.content);
      expect(message).toHaveProperty('username', testUser.username);
      expect(message).toHaveProperty('id');
      expect(message).toHaveProperty('timestamp');
      done();
    });

    clientSocket.emit('message', testMessage);
  });

  test('should handle message errors', (done) => {
    clientSocket.on('error', (error) => {
      expect(error).toHaveProperty('message');
      done();
    });

    // Send invalid message
    clientSocket.emit('message', {});
  });

  test('should reject connection with invalid token', (done) => {
    const invalidSocket = new Client(`http://localhost:${httpServer.address().port}`, {
      auth: { token: 'invalid-token' }
    });

    invalidSocket.on('connect_error', (error) => {
      expect(error.message).toBe('Invalid token');
      invalidSocket.close();
      done();
    });
  });
});