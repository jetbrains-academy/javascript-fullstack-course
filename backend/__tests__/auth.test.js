import request from 'supertest';
import { httpServer } from '../src/index.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../src/middleware/auth.js';


describe('Authentication API', () => {
  beforeAll(() => {
  });

  afterAll((done) => {
      httpServer.close(done);
  });

  beforeEach(() => {
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username', 'testuser');

      // Verify token
      console.log('[DEBUG_LOG] Token from response:', response.body.token);
      console.log('[DEBUG_LOG] JWT_SECRET in test:', JWT_SECRET);
      const decoded = jwt.verify(response.body.token, JWT_SECRET);
      expect(decoded).toHaveProperty('username', 'testuser');
    });

    it('should not allow duplicate usernames', async () => {
      // Register first user
      await request(httpServer)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Try to register the same username
      const response = await request(httpServer)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'differentpassword'
        });

      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('message', 'Username already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeAll(async () => {
      // Create a test user before login test
      await request(httpServer)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username', 'testuser');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should fail with non-existent username', async () => {
      const response = await request(httpServer)
        .post('/api/auth/login')
        .send({
          username: 'nonexistent',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });
  });
});
