import { io as Client } from 'socket.io-client';
import { httpServer } from '../src/index.js';
import {userService, messageService} from '../src/data/dataServices.js';
import { generateToken } from '../src/middleware/auth.js';

describe('Socket.IO Chat', () => {
  let clientSocket;
  const testUser = {
    username: 'testuser',
    password: 'password123'
  };
  let authToken;

  beforeAll(() => {
    userService.createUser(testUser.username, testUser.password);
    authToken = generateToken(testUser.username);
  });

  beforeEach((done) => {
    clientSocket = new Client(`http://localhost:${httpServer.address().port}`, {
      auth: {
        token: authToken,
        reconnection: false
      }
    });
    clientSocket.on('connect', done);
  });

  afterEach(() => {
    clientSocket.close();
  });

  afterAll((done) => {
    httpServer.close(done);
  });

  describe('Authentication', () => {
    it('should authenticate with valid token', () => {
      expect(clientSocket.connected).toBe(true);
    });

    it('should reject connection with invalid token', (done) => {
      const invalidSocket = new Client(`http://localhost:${httpServer.address().port}`, {
        auth: { token: 'invalid-token', reconnection: false }
      });
      invalidSocket.on('connect_error', (error) => {
        try {
          expect(error.message).toBe('Invalid token');
          done(); // Called if the assertion passes
        } catch (err) {
          done(err); // Mark the test as failed if the assertion fails
        }
      });
    });

    it('should reject connection without token', (done) => {
      const noTokenSocket = new Client(`http://localhost:${httpServer.address().port}`, {
        auth: {}
      });

      noTokenSocket.on('connect_error', (error) => {
        try {
          expect(error.message).toBe('Authentication token required');
          done(); // Called if the assertion passes
        } catch (err) {
          done(err); // Mark the test as failed if the assertion fails
        }
      });

    });
  });

  describe('Messaging', () => {
    it('should broadcast messages to all clients', (done) => {
      const testMessage = { content: 'Hello, WebSocket!' };

      clientSocket.on('message', (message) => {
        try {
          expect(message).toMatchObject({
            content: testMessage.content,
            username: testUser.username,
            id: expect.any(Number),
            timestamp: expect.any(String)
          });
          // Verify timestamp is valid ISO string
          expect(() => new Date(message.timestamp)).not.toThrow();
          done(); // Called if the assertion passes
        } catch (err) {
          done(err); // Mark the test as failed if the assertion fails
        }
      });

      clientSocket.emit('message', testMessage);
    });


    it('should store message in database', (done) => {
      const testMessage = { content: 'Test message for storage' };
      clientSocket.on('message', async (message) => {
        try {
          // Verify message is stored
          const storedMessages = await messageService.getMessages(1);
          expect(storedMessages.length).toBe(1);
          expect(storedMessages[0].content).toBe(testMessage.content);
          expect(storedMessages[0].username).toBe(testUser.username);
          done(); // Called if the assertion passes
        } catch (err) {
          done(err); // Mark the test as failed if the assertion fails
        }
      });
      clientSocket.emit('message', testMessage);
    });
  });
});
