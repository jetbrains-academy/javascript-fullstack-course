import {render, screen, fireEvent, waitFor} from '@testing-library/react';
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

test('Chat sends a new message correctly', async () => {
    try {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' }
        ];

        // Mock backend API calls
        axios.get = jest.fn().mockResolvedValue({ data: mockMessages });
        axios.post = jest.fn().mockResolvedValue();

        localStorage.setItem('token', 'mockToken');

        render(<Chat onLogout={onLogoutMock} />);

        // Simulate message input
        const inputField = screen.getByPlaceholderText('Type a message...');
        fireEvent.change(inputField, { target: { value: 'New test message' } });

        // Simulate form submission (sending a message)
        const sendButton = screen.getByText('Send');
        fireEvent.click(sendButton);

        // Verify POST request
        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/api/messages',
                { content: 'New test message' },
                { headers: { Authorization: `Bearer mockToken` } }
            );
        }, { timeout: 1000 }); // Timeout of 1 second

        // Verify input field is cleared
        expect(inputField.value).toBe('');
    } catch (e) {
        customizeError(e, 'Failed to display fetched messages', true);
        throw e;
    }
});
