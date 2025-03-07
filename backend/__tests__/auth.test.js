import request from 'supertest';
import { app } from '../src/index.js';
import { userService } from '../src/data/dataServices.js';
import jwt from 'jsonwebtoken';

describe('Authentication API', () => {
  beforeEach(() => {
    // Clear users before each test
    userService.users.clear();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('username', 'testuser');

      // Verify token
      const decoded = jwt.verify(response.body.token, process.env.JWT_SECRET || 'your-secret-key');
      expect(decoded).toHaveProperty('username', 'testuser');
    });

    it('should not allow duplicate usernames', async () => {
      // Register first user
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });

      // Try to register the same username
      const response = await request(app)
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
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
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
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          username: 'testuser',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid username or password');
    });

    it('should fail with non-existent username', async () => {
      const response = await request(app)
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