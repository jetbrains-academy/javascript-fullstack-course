import request from 'supertest';
import { httpServer } from '../backend/src/index.js';
import { store } from '../backend/src/data/dataServices.js';

import {customizeError} from '#utils/utils.js'

beforeAll(() => {
});

afterAll(done => {
    httpServer.close(done);
});

beforeEach(() => {
    store.users.clear();
    store.messages = [];
});

test('Test POST /api/messages with valid data', async () => {
    try {
        const response = await request(httpServer)
            .post('/api/messages')
            .send({ username: 'User', content: 'Hello, World!' })
            .timeout(4000);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            username: 'User',
            content: 'Hello, World!',
            id: expect.any(String),
        });

    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/messages with valid data: ', true);
        throw e;
    }
});

test('Test POST /api/messages without content', async () => {
    try {
        const response = await request(httpServer)
            .post('/api/messages')
            .send({ username: 'User' })
            .timeout(4000);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Message content is required');

    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/messages without content: ', true);
        throw e;
    }
});

test('Test GET /api/messages initially empty', async () => {
    try {
        const response = await request(httpServer).get('/api/messages')
            .timeout(4000);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([]);

    } catch (e) {
        customizeError(e, 'Failed to handle GET /api/messages when empty: ', true);
        throw e;
    }
});

test('Test GET /api/messages with data', async () => {
    try {
        for (let i = 0; i < 3; i++) {
            await request(httpServer)
                .post('/api/messages')
                .send({ username: 'Testuser', content: `Test message ${i}` })
                .timeout(4000);
        }

        const response = await request(httpServer).get('/api/messages')
            .timeout(4000);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[2].content).toBe('Test message 2');

    } catch (e) {
        customizeError(e, 'Failed to handle GET /api/messages with data: ', true);
        throw e;
    }
});
