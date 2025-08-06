import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Chat from '../src/pages/Chat.jsx';
import { jest } from '@jest/globals';

describe('Chat tests', () => {
    let onLogoutMock= jest.fn();

    beforeEach(() => {
        onLogoutMock = jest.fn();
        jest.clearAllMocks();
        localStorage.clear();
    });

    it('retrieving messages', async () => {
        const mockMessages = [
            { id: 1, username: 'User1', content: 'First message' },
            { id: 2, username: 'User2', content: 'Second message' }
        ];
        axios.get = jest.fn().mockResolvedValue({ data: mockMessages });

        localStorage.setItem('token', 'mockToken');

        render(<Chat onLogout={onLogoutMock} />);

        expect(axios.get).toHaveBeenCalledWith('/api/messages', {
            headers: { Authorization: `Bearer mockToken` }
        });

        // Ensure messages are displayed correctly
        for (const message of mockMessages) {
            await screen.findByText(`${message.username}:`);
            expect(screen.getByText(message.content)).toBeInTheDocument();
        }

    });
});
