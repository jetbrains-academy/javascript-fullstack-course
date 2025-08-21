import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { customizeError } from '#utils/utils.js';
import App from '../frontend/src/App';
import { jest } from '@jest/globals';
import {BrowserRouter} from "react-router-dom";

let onLoginMock = jest.fn();

beforeEach(() => {
    onLoginMock = jest.fn();
    jest.clearAllMocks();
    localStorage.clear();
});

const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test Page', route);
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('App verifies token presence in localStorage and updates authentication state', () => {
    try {
        localStorage.setItem('token', 'mockToken');

        renderWithRouter(<App />, { route: '/login' });

        expect(localStorage.getItem('token')).toBe('mockToken');
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to verify token presence in localStorage', true);
        throw e;
    }
});

test('App handles absence of token: updates authentication state to false', () => {
    try {
        renderWithRouter(<App />, { route: '/login' });

        expect(localStorage.getItem('token')).toBe(null);
        expect(screen.getByText('Login to Chat')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to handle absence of token in localStorage', true);
        throw e;
    }
});

test('Chat removes token from localStorage upon logout', () => {
    try {
        localStorage.setItem('token', 'mockToken');

        renderWithRouter(<App />, { route: '/chat' });

        const logoutButton = screen.getByText('Logout');
        fireEvent.click(logoutButton);

        expect(localStorage.getItem('token')).toBe(null);
        expect(screen.getByText('Login to Chat')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to remove token from localStorage on logout', true);
        throw e;
    }
});
