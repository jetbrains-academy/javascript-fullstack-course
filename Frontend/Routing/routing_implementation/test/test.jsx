import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from '../frontend/src/App.jsx';
import { act } from 'react-dom/test-utils';

import { customizeError } from '#utils/utils.js';

// Helper function to render components with routing context
const renderWithRouter = (ui, { route = '/' } = {}) => {
    window.history.pushState({}, 'Test Page', route);
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

test('navigates to the Register page and renders the Register form', () => {
    try {
        renderWithRouter(<App />, { route: '/register' });

        // Verify Register page is rendered
        expect(screen.getByText('Register for Chat')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to render the /register page', true);
        throw e;
    }
});

test('redirects to login if trying to access chat page while unauthenticated', () => {
    try {
        renderWithRouter(<App />, { route: '/chat' });

        // Ensure unauthenticated users are redirected to login
        expect(screen.getByText('Login to Chat')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to redirect unauthenticated users to the /login page from the /chat page', true);
        throw e;
    }
});

test('navigates to chat page after successful login', async () => {
    try {
        const { container } = renderWithRouter(<App />);

        // Fill out login form
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

        // Simulate form submission
        fireEvent.click(screen.getByText('Login'));

        // Ensure navigation to chat page
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();

        // Ensure login form is no longer visible
        expect(container.querySelectorAll('.login-form').length).toBe(0);
    } catch (e) {
        customizeError(e, 'Failed to navigate to the /chat page after Login', true);
        throw e;
    }
});

test('logs out from the chat page and returns to the login page', async () => {
    try {
        const { container } = renderWithRouter(<App />);

        // Simulate a successful login
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Login'));

        // Verify navigation to the chat page
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();

        // Simulate logout action
        const logoutButton = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutButton);

        // Ensure user is redirected to login page
        expect(screen.getByText('Login to Chat')).toBeInTheDocument();

        // Ensure no duplicate elements are rendered
        expect(container.querySelectorAll('.login-form').length).toBe(1);
    } catch (e) {
        customizeError(e, 'Failed to log out and redirect to the /login page', true);
        throw e;
    }
});

test('redirects authenticated users trying to access Register page back to chat', async () => {
    try {
        const { container } = renderWithRouter(<App />);

        // Simulate a successful login
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
        fireEvent.click(screen.getByText('Login'));

        // Verify navigation to the chat page
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();

        // Attempt to access the Register page directly
        act(() => {
            window.history.pushState({}, '', '/register');
        });
        renderWithRouter(<App />, { route: '/register' });

        // Ensure user remains on the chat page
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();

        // Verify no rendering of login forms happens
        expect(container.querySelectorAll('.login-form').length).toBe(0);
    } catch (e) {
        customizeError(e, 'Failed to redirect authenticated user from the /register page to the /chat', true);
        throw e;
    }
});

test('navigates to the Register page and proceeds to chat page after registration', () => {
    try {
        renderWithRouter(<App />, { route: '/register' });

        // Verify Register form is rendered
        expect(screen.getByText('Register for Chat')).toBeInTheDocument();

        // Fill out and submit the Register form
        fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'newpassword123' } });
        fireEvent.change(screen.getByLabelText('Confirm Password'), { target: { value: 'newpassword123' } });
        fireEvent.click(screen.getByText('Register'));

        // Ensure user is redirected to chat page
        expect(screen.getByText('Chat will be here.')).toBeInTheDocument();
    } catch (e) {
        customizeError(e, 'Failed to navigate to the /chat page after registration', true);
        throw e;
    }
});