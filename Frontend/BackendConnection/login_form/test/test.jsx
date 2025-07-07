import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Login from '../frontend/src/pages/Login';
import { customizeError } from '#utils/utils.js';
import { jest } from '@jest/globals';

let onLoginMock = jest.fn();

beforeEach(() => {
    onLoginMock = jest.fn();
    jest.clearAllMocks();
});

test('displays an error when login fails', async () => {
    try {
        axios.post = jest.fn().mockRejectedValue({
            response: { data: { message: 'Invalid credentials' } },
        });

        render(<Login onLogin={onLoginMock} />);

        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'user' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'wrongPassword' },
        });

        fireEvent.click(screen.getByText('Login'));

        const errorMessage = await screen.findByText('Invalid credentials');
        expect(errorMessage).toBeInTheDocument();
        expect(onLoginMock).toHaveBeenCalledTimes(0);
    } catch (e) {
        customizeError(e, 'Failed to display login error message', true);
        throw e;
    }
});

test('calls the backend API and logs in successfully', async () => {
    try {
        axios.post = jest.fn().mockResolvedValue({
            data: { token: 'mockToken' },
        });

        render(<Login onLogin={onLoginMock} />);

        fireEvent.change(screen.getByLabelText('Username'), {
            target: { value: 'user' },
        });
        fireEvent.change(screen.getByLabelText('Password'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByText('Login'));

        expect(axios.post).toHaveBeenCalledWith('/api/auth/login', {
            username: 'user',
            password: 'password123',
        });

        await screen.findByText('Login to Chat');

        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(onLoginMock).toHaveBeenCalledTimes(1);
    } catch (e) {
        customizeError(e, 'Failed to handle successful login', true);
        throw e;
    }
});