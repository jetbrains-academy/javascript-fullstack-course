import { io as Client } from 'socket.io-client';
import { httpServer } from '../backend/src/index.js';
import {store, messageService } from '../backend/src/data/dataServices.js';
import {customizeError} from "#utils/utils.js";

// Common setup and cleanup for tests
let clientSocket;

beforeEach((done) => {
    clientSocket = new Client(`http://localhost:${httpServer.address().port}`, {
        reconnection: false,
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

test('Test message event - Should broadcast messages to all clients', (done) => {
    const testMessage = { username: 'User', content: 'Hello, WebSocket!' };

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

test('Test error event - Should notify of an error if it occurs', (done) => {
    const testMessage = null;

    clientSocket.on('error', (message) => {
        try {
            expect(message).toMatchObject({
                message: 'Error sending message',
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
    const testMessage = { username: 'User', content: 'Storing test message' };

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
