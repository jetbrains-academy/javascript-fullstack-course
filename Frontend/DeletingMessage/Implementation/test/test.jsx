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

test('Chat deletes a message when delete button is clicked', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages);

        render(<Chat onLogout={onLogoutMock} />);

        await screen.findByText('First message');
        expect(screen.getByText('Second message')).toBeInTheDocument();

        const deleteButton = screen.getAllByAltText('Delete')[0];
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(socketMock.emit).toHaveBeenCalledWith('deleteMessage', { messageId: 1 });
        });
    } catch (e) {
        customizeError(e, 'Deleting a message via delete button failed', true);
        throw e;
    }
});

test('Chat removes a message from the list when messageDeleted event is received', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages);

        render(<Chat onLogout={onLogoutMock} />);

        await screen.findByText('First message');
        expect(screen.getByText('Second message')).toBeInTheDocument();

        const messageDeletedCallback = socketMock.on.mock.calls.find(call => call[0] === 'messageDeleted')[1];
        act(() => {
            messageDeletedCallback({ messageId: 1 });
        });

        expect(screen.queryByText('First message')).not.toBeInTheDocument();
        expect(screen.getByText('Second message')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Handling messageDeleted event failed', true);
        throw e;
    }
});

