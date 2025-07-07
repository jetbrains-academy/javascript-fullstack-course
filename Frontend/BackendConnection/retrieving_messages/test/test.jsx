import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { customizeError } from '#utils/utils.js';
import Chat from '../frontend/src/pages/Chat';
import { jest } from '@jest/globals';
import axios from 'axios';

let onLogoutMock = jest.fn();

beforeEach(() => {
    onLogoutMock = jest.fn();
    jest.clearAllMocks();
    localStorage.clear();
});

const mockAxiosGet = (data) => {
    axios.get = jest.fn().mockResolvedValue({ data });
};

test('Chat fetches and displays messages correctly', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];

        mockAxiosGet(mockMessages); // Mock messages returned by API
        localStorage.setItem('token', 'mockToken');

        render(<Chat onLogout={onLogoutMock} />);

        expect(axios.get).toHaveBeenCalledWith('/api/messages', {
            headers: { Authorization: 'Bearer mockToken' }
        });

        for (const message of mockMessages) {
            await screen.findByText(`${message.username}:`);
            expect(screen.getByText(message.content)).toBeInTheDocument();
        }
    } catch (e) {
        customizeError(e, 'Failed to display fetched messages', true);
        throw e;
    }
});
