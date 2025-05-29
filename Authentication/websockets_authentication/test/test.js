import { io as Client } from 'socket.io-client';
import {store, messageService } from '../backend/src/data/dataServices.js';
import {customizeError} from "#utils/utils.js";
import request from "supertest";
import fs from "fs";
import path from 'path';


const sourceEnvPath = path.resolve('./Authentication/task/backend/.env');
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

// Common setup and cleanup for tests
let clientSocket;
let authToken;
const testUser = {
    username: 'User',
    password: '1234'
};

beforeAll(async () => {
    // Register and login test user
    const registerResponse = await request(httpServer)
        .post('/api/auth/register')
        .send(testUser);

    authToken = registerResponse.body.token;
})

beforeEach((done) => {
    clientSocket = new Client(`http://localhost:${httpServer.address().port}`, {
        reconnection: false,
        auth: {
            token: authToken
        }
    });
    clientSocket.on('connect', done);
});

afterEach(() => {
    clientSocket.close();
    store.messages = []
});

afterAll((done) => {
    httpServer.close(done);
});

test('Test authentication - Should not allow unauthorized access', (done) => {
    const noTokenSocket = new Client(`http://localhost:${httpServer.address().port}`, {
        auth: {}
    });
    noTokenSocket.on('connect_error', (error) => {
        try {
            expect(error.message).toBe('Authentication token required');
            done();
        } catch (err) {
            customizeError(err, 'Failed to check unauthorized access: ', true);
            done(err);
        } finally {
            noTokenSocket.close();
        }
    })
})

test('Test message event - Should broadcast messages to all clients', (done) => {
    const testMessage = { content: 'Hello, WebSocket!' };

    clientSocket.on('message', (message) => {
        try {
            expect(message).toMatchObject({
                username: 'User',
                content: 'Hello, WebSocket!',
                id: expect.any(String),
            });
            done();
        } catch (err) {
            customizeError(err, 'Failed to check broadcasted messages to all clients: ', true);
            done(err);
        }
    });

    clientSocket.emit('message', testMessage);
});

test('Test message storage - Should store message in database', (done) => {
    const testMessage = { content: 'Storing test message' };

    clientSocket.on('message', async () => {
        try {
            const messages = await messageService.getMessages();
            const storedMessage = messages[messages.length - 1];

            expect(storedMessage).toMatchObject({
                username: 'User',
                content: 'Storing test message',
                id: expect.any(String),
            });
            done();
        } catch (err) {
            customizeError(err, 'Failed to check stored message in message service: ', true);
            done(err);
        }
    });

    clientSocket.emit('message', testMessage);
});
