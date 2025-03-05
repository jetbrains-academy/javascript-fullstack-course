import request from 'supertest';
import { app } from '../src/index.js';
import { userService, messageService } from '../src/data/index.js';
import { generateToken } from '../src/middleware/auth.js';

describe('Messages API', () => {
  let authToken;
  const testUser = {
    username: 'testuser',
    password: 'password123'
  };

  beforeEach(async () => {
    // Clear data
    userService.users.clear();
    messageService.messages = [];

    // Create test user and get token
    await request(app)
      .post('/api/auth/register')
      .send(testUser);
    
    authToken = generateToken(testUser.username);
  });

  describe('GET /api/messages', () => {
    it('should get empty message list initially', async () => {
      const response = await request(app)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should get messages with limit', async () => {
      // Add some test messages
      for (let i = 0; i < 3; i++) {
        messageService.addMessage(testUser.username, `Test message ${i}`);
      }

      const response = await request(app)
        .get('/api/messages?limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('POST /api/messages', () => {
    it('should create a new message', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Hello, World!' });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('content', 'Hello, World!');
      expect(response.body).toHaveProperty('username', testUser.username);
    });

    it('should fail without content', async () => {
      const response = await request(app)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Message content is required');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/messages')
        .send({ content: 'Hello, World!' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/messages/:id', () => {
    it('should delete an existing message', async () => {
      // Create a message first
      const message = messageService.addMessage(testUser.username, 'Test message');

      const response = await request(app)
        .delete(`/api/messages/${message.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify message is deleted
      const messages = messageService.getMessages();
      expect(messages).toHaveLength(0);
    });

    it('should return 404 for non-existent message', async () => {
      const response = await request(app)
        .delete('/api/messages/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });
  });
});