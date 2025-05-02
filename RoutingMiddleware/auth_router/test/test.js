import request from 'supertest';
import { httpServer } from '../backend/src/index.js';
import { store } from '../backend/src/data/dataServices.js';

import { customizeError } from '#utils/utils';

beforeAll(() => {});

afterAll(done => {
    httpServer.close(done);
});

beforeEach(() => {
    store.users.clear();
});

// Test for user registration
test('Test POST /api/auth/register - Register new user successfully', async () => {
    try {
        const response = await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('username', 'testuser');
    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/auth/register - Register new user: ', true);
        throw e;
    }
});

test('Test POST /api/auth/register - Duplicate username protection', async () => {
    try {
        // Register the first user
        await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        // Attempt to register the same username again
        const response = await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'differentpassword',
            });

        expect(response.status).toBe(409);
        expect(response.body).toHaveProperty('message', 'Username already exists');
    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/auth/register - Duplicate username: ', true);
        throw e;
    }
});

test('Test POST /api/auth/login - Successful login with correct credentials', async () => {
    try {
        // Register a test user
        await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        const response = await request(httpServer)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('username', 'testuser');
    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/auth/login - Successful login with correct credentials: ', true);
        throw e;
    }
});

test('Test POST /api/auth/login - Fail with incorrect password', async () => {
    try {
        // Register a test user
        await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        const response = await request(httpServer)
            .post('/api/auth/login')
            .send({
                username: 'testuser',
                password: 'wrongpassword',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid username or password');
    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/auth/login - Incorrect password: ', true);
        throw e;
    }
});

test('Test POST /api/auth/login - Fail with non-existent username', async () => {
    try {
        // Register a test user
        await request(httpServer)
            .post('/api/auth/register')
            .send({
                username: 'testuser',
                password: 'password123',
            });

        const response = await request(httpServer)
            .post('/api/auth/login')
            .send({
                username: 'nonexistent',
                password: 'password123',
            });

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message', 'Invalid username or password');
    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/auth/login - Non-existent username: ', true);
        throw e;
    }
});