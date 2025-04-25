import {store, messageService} from '../backend/src/data/dataServices.js';

import {customizeError} from '#utils/utils'

beforeEach(() => {
    store.messages = [];
})

test('Test add new message', async () => {
    try {
        await messageService.addMessage('John', 'Hello world')
            .then(message => {
                try {
                    expect(store.messages.length).toBe(1)
                } catch (e) {
                    customizeError(e, 'Messages array should contain 1 message after adding new message: ');
                    throw e;
                }
                try{
                    expect(message.username).toBe('John')
                    expect(store.messages[0].username).toBe('John')
                    expect(message.content).toBe('Hello world')
                    expect(store.messages[0].content).toBe('Hello world')
                } catch (e) {
                    customizeError(e, 'Failed to check username or message content while adding new message: ');
                    throw e;
                }
                try {
                    expect(message.id).toBeDefined()
                    expect(store.messages[0].id).toBeDefined()
                } catch (e) {
                    customizeError(e, 'Failed to check message id: ');
                    throw e;
                }
            })
    } catch (e) {
        e.stack = null;
        throw e
    }
});

test('Test get messages with default limit', async () => {
    try {
        await messageService.addMessage('John', 'Message 1')
        await messageService.addMessage('John', 'Message 2')
        await messageService.getMessages()
            .then(messages => {
                expect(messages.length).toBe(2)
                expect(messages[0].content).toBe('Message 1')
                expect(messages[1].content).toBe('Message 2')
            })
    } catch (e) {
        customizeError(e, 'Failed to get messages with default limit: ', true)
        throw e
    }
});

test('Test get messages with custom limit', async () => {
    try {
        await messageService.addMessage('John', 'Message 1')
        await messageService.addMessage('John', 'Message 2')
        await messageService.addMessage('John', 'Message 3')
        await messageService.getMessages(2)
            .then(messages => {
                expect(messages.length).toBe(2)
                expect(messages[0].content).toBe('Message 2')
                expect(messages[1].content).toBe('Message 3')
            })
    } catch (e) {
        customizeError(e, 'Failed to get messages with custom limit: ', true)
        throw e
    }
});
