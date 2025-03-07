import request from 'supertest';
import { httpServer } from '../src/index.js';
import store from '../src/data/dataServices.js';

describe('Messages API', () => {
  let authToken;
  const testUser = {
    username: 'testuser',
    password: 'password123'
  };

  beforeAll(() => {
  });

  afterAll((done) => {
    httpServer.close(done);
  });

  beforeEach(async () => {
    // Clear data
    store.users.clear();
    store.messages = [];

    // Register and login test user
    const registerResponse = await request(httpServer)
      .post('/api/auth/register')
      .send(testUser);

    authToken = registerResponse.body.token;
  });

  describe('GET /api/messages', () => {
    it('should get empty message list initially', async () => {
      const response = await request(httpServer)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should get messages with default limit', async () => {
      // Add test messages
      const messagesToAdd = 60;
      for (let i = 0; i < messagesToAdd; i++) {
        await request(httpServer)
          .post('/api/messages')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: `Test message ${i}` });
      }

      const response = await request(httpServer)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(50); // Default limit
      expect(response.body[49].content).toBe('Test message 59'); // Latest message
    });

    it('should get messages with custom limit', async () => {
      // Add test messages
      for (let i = 0; i < 3; i++) {
        await request(httpServer)
          .post('/api/messages')
          .set('Authorization', `Bearer ${authToken}`)
          .send({ content: `Test message ${i}` });
      }

      const response = await request(httpServer)
        .get('/api/messages?limit=2')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[1].content).toBe('Test message 2');
    });

    it('should fail without authentication', async () => {
      const response = await request(httpServer)
        .get('/api/messages');

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/messages', () => {
    it('should create a new message with correct structure', async () => {
      const response = await request(httpServer)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Hello, World!' });

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        content: 'Hello, World!',
        username: testUser.username,
        id: expect.any(Number),
        timestamp: expect.any(String)
      });

      // Verify timestamp is valid ISO string
      expect(() => new Date(response.body.timestamp)).not.toThrow();
    });

    it('should fail with empty content', async () => {
      const response = await request(httpServer)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: '' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Message content is required');
    });

    it('should fail without content field', async () => {
      const response = await request(httpServer)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Message content is required');
    });

    it('should fail without authentication', async () => {
      const response = await request(httpServer)
        .post('/api/messages')
        .send({ content: 'Hello, World!' });

      expect(response.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(httpServer)
        .post('/api/messages')
        .set('Authorization', 'Bearer invalid_token')
        .send({ content: 'Hello, World!' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/messages/:id', () => {
    it('should delete an existing message', async () => {
      // Create a message
      const createResponse = await request(httpServer)
        .post('/api/messages')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ content: 'Test message' });

      const messageId = createResponse.body.id;

      // Delete the message
      const deleteResponse = await request(httpServer)
        .delete(`/api/messages/${messageId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(deleteResponse.status).toBe(204);

      // Verify message is deleted
      const getResponse = await request(httpServer)
        .get('/api/messages')
        .set('Authorization', `Bearer ${authToken}`);

      expect(getResponse.body).toHaveLength(0);
    });

    it('should return 404 for non-existent message', async () => {
      const response = await request(httpServer)
        .delete('/api/messages/999999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
    });

    it('should fail without authentication', async () => {
      const response = await request(httpServer)
        .delete('/api/messages/1');

      expect(response.status).toBe(401);
    });

    it('should fail with invalid token', async () => {
      const response = await request(httpServer)
        .delete('/api/messages/1')
        .set('Authorization', 'Bearer invalid_token');

      expect(response.status).toBe(401);
    });
  });
});
