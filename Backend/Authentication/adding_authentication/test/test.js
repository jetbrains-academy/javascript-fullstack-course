import fs from 'fs';
import request from 'supertest';
import { store } from '../backend/src/data/dataServices.js';
import {customizeError} from '#utils/utils.js'
import path from 'path';


const sourceEnvPath = path.resolve('./Backend/Authentication/task/backend/.env');
const targetEnvPath = path.resolve('./.env');

// Check if the .env file already exists
if (!fs.existsSync(targetEnvPath)) {
    if (fs.existsSync(sourceEnvPath)) {
        fs.copyFileSync(sourceEnvPath, targetEnvPath);
    } else {
        console.error(`Source .env file not found at ${sourceEnvPath}`);
        process.exit(1); // Exit if source .env does not exist
    }
}


// Dynamic import to ensure the .env file will be copied
const { httpServer } = await import('../backend/src/index.js');

let authToken;
const testUser = {
    username: 'User',
    password: 'password123',
};


beforeAll(() => {

});

afterAll(done => {
    httpServer.close(done);
});

beforeEach(() => {
    store.users.clear();
    store.messages = [];
    return request(httpServer)
        .post('/api/auth/register')
        .send(testUser)
        .timeout(4000)
        .then(registerResponse => {
            authToken = registerResponse.body.token;
        });
});

test('Test POST /api/messages with valid data', async () => {
    try {
        const response = await request(httpServer)
            .post('/api/messages')
            .set('Authorization', `Bearer ${authToken}`)
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
            .set('Authorization', `Bearer ${authToken}`)
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
        const response = await request(httpServer).get('/api/messages').set('Authorization', `Bearer ${authToken}`)
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
                .set('Authorization', `Bearer ${authToken}`)
                .send({ username: 'User', content: `Test message ${i}` })
                .timeout(4000);
        }

        const response = await request(httpServer).get('/api/messages').set('Authorization', `Bearer ${authToken}`)
            .timeout(4000);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(3);
        expect(response.body[2].content).toBe('Test message 2');

    } catch (e) {
        customizeError(e, 'Failed to handle GET /api/messages with data: ', true);
        throw e;
    }
});

test('Test POST /api/messages without token', async () => {
    try {
        const response = await request(httpServer)
            .post('/api/messages')
            .send({ username: 'User', content: 'Unauthorized message' })
            .timeout(4000);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    } catch (e) {
        customizeError(e, 'Failed to handle POST /api/messages without token: ', true);
        throw e;
    }
});

test('Test GET /api/messages without token', async () => {
    try {
        const response = await request(httpServer).get('/api/messages')
            .timeout(4000);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');

    } catch (e) {
        customizeError(e, 'Failed to handle GET /api/messages without token: ', true);
        throw e;
    }
});
