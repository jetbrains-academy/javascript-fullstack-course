import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { customizeError } from '#utils/utils.js';
import { jest } from '@jest/globals';
import axios from 'axios';

const socketMock = {
    connect: jest.fn(),
    disconnect: jest.fn(),
    emit: jest.fn(),
    on: jest.fn(),
    params: {}
};

jest.unstable_mockModule('socket.io-client', () => ({
    __esModule: true,
    default: (...args) => {
        socketMock.params.url = args[0] ?? null;
        socketMock.params.opts = args[1] ?? null;
        return socketMock;
    }
}));

const chat_module = await import('../frontend/src/pages/Chat.jsx');
const { default: Chat } = chat_module;

let onLogoutMock = jest.fn();

beforeEach(() => {
    onLogoutMock = jest.fn();
    socketMock.connect = jest.fn();
    socketMock.disconnect = jest.fn();
    socketMock.emit = jest.fn();
    socketMock.on = jest.fn();
    socketMock.params = {};
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('token', 'mockToken');
});

const mockAxiosGet = (data) => {
    axios.get = jest.fn().mockResolvedValue({ data });
};

test('Chat initializes WebSocket connection correctly', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages);

        render(<Chat onLogout={onLogoutMock} />);

        await waitFor(() => {
            expect(socketMock.params.url).toBe('/');
            expect(socketMock.params.opts).toStrictEqual({ auth: { token: 'mockToken' } });
        });
    } catch (e) {
        customizeError(e, 'WebSocket initialization failed', true);
        throw e;
    }
});

test('Chat sends a new message correctly via WebSocket', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages);

        render(<Chat onLogout={onLogoutMock} />);

        const inputField = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(inputField, { target: { value: 'New test message' } });

        const sendButton = screen.getByText('Send');
        fireEvent.click(sendButton);

        await waitFor(() => {
            expect(socketMock.emit).toHaveBeenCalledWith('message', { content: 'New test message' });
        });

        expect(inputField.value).toBe('');
    } catch (e) {
        customizeError(e, 'Sending message failed', true);
        throw e;
    }
});

test('Chat displays messages received via WebSocket', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages);

        render(<Chat onLogout={onLogoutMock} />);

        await screen.findByText('First message');
        expect(screen.getByText('Second message')).toBeInTheDocument();

        const newMessage = { id: 3, username: 'User3', content: 'New incoming message' };
        const messageCallback = socketMock.on.mock.calls.find(call => call[0] === 'message')[1];
        act(() => {
            messageCallback(newMessage);
        });

        expect(await screen.findByText('User3:')).toBeInTheDocument();
        expect(screen.getByText('New incoming message')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Displaying received messages failed', true);
        throw e;
    }
});
