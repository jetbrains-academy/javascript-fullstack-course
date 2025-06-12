import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../src/App';

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Message Input')).toBeInTheDocument();
  });

  test('allows entering text in the input field', () => {
    render(<App />);
    const input = screen.getByLabelText('Message input');
    
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    expect(input.value).toBe('Hello, World!');
  });

  test('displays the entered message', () => {
    render(<App />);
    const input = screen.getByLabelText('Message input');
    
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    expect(screen.getByText('Your message: Hello, World!')).toBeInTheDocument();
  });

  test('does not display message section when input is empty', () => {
    render(<App />);
    const messageText = screen.queryByText(/Your message:/);
    
    expect(messageText).not.toBeInTheDocument();
  });
});