import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('Message Input')).toBeInTheDocument();
  });

  it('allows entering text in the input field', () => {
    render(<App />);
    const input = screen.getByLabelText('Message input');
    
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    expect(input.value).toBe('Hello, World!');
  });

  it('displays the entered message', () => {
    render(<App />);
    const input = screen.getByLabelText('Message input');
    
    fireEvent.change(input, { target: { value: 'Hello, World!' } });
    
    expect(screen.getByText('Your message: Hello, World!')).toBeInTheDocument();
  });

  it('does not display message section when input is empty', () => {
    render(<App />);
    const messageText = screen.queryByText(/Your message:/);
    
    expect(messageText).not.toBeInTheDocument();
  });
});