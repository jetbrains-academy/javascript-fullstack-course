import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Register from '../frontend/src/pages/Register';
import { customizeError } from '#utils/utils.js';
import {jest} from "@jest/globals";

let onLoginMock= jest.fn();

beforeEach(() => {
    onLoginMock = jest.fn();
});

test('displays an error when passwords do not match', async () => {
    try {
        render(<Register onLogin={jest.fn()} />);

        // Fill form fields
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password456' } });

        // Submit form
        fireEvent.click(screen.getByText('Register'));

        // Verify error
        const errorMessage = await screen.findByText('Passwords do not match');
        expect(errorMessage).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to display password mismatch error', true);
        throw e;
    }
});

test('calls the backend API on successful registration', async () => {
    try {
        axios.post = jest.fn().mockResolvedValue({ data: { token: 'mockToken' } });

        render(<Register onLogin={onLoginMock} />);

        // Fill form fields
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'user' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'password123' } });

        // Submit form
        fireEvent.click(screen.getByText('Register'));

        // Wait for re-render
        await screen.findByText(/Register for Chat/i);

        // Verify API call
        expect(axios.post).toHaveBeenCalledWith('/api/auth/register', {
            username: 'user',
            password: 'password123',
        });

        // Verify token storage and callback
        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(onLoginMock).toHaveBeenCalledTimes(1);
    } catch (e) {
        customizeError(e, 'Failed to call backend API or handle successful registration', true);
        throw e;
    }
});