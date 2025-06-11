import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import deleteIcon from '../assets/delete.svg';
import { useNavigate } from 'react-router-dom';

function Chat({ onLogout }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Load message history
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    // Initialize Socket.IO connection
    const newSocket = io('/', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    newSocket.on('message', (message) => {
      setMessages(prev => [...prev, message]);
    });

    // Listen for message deletion events
    newSocket.on('messageDeleted', (data) => {
      setMessages(prev => prev.filter(message => message.id !== data.messageId));
    });

    // Listen for error events
    newSocket.on('error', (error) => {
      console.error('Socket error:', error);
      // You could add a toast notification here
    });

    setSocket(newSocket);
    fetchMessages();

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      // const token = localStorage.getItem('token');
      // await axios.post('/api/messages',
      //   { content: newMessage },
      //   { headers: { Authorization: `Bearer ${token}` } }
      // );

      socket?.emit('message', { content: newMessage });
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDelete = async (messageId) => {
    try {
      // Use REST API to delete the message
      const token = localStorage.getItem('token');
      await axios.delete(`/api/messages/${messageId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // After successful deletion via REST API, emit socket event to notify other clients
      socket?.emit('deleteMessage', { messageId });

      // Update local state immediately for better UX
      setMessages(prev => prev.filter(message => message.id !== messageId));
    } catch (error) {
      console.error('Failed to delete message:', error);
    }
  };

  const handleLogout = () => {
    // Close the socket connection
    socket?.close();

    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Call the onLogout prop to update the authentication state in App.jsx
    onLogout();

    // Navigate to the login page
    navigate('/login');
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <button 
          onClick={handleLogout} 
          className="logout-button"
        >
          Logout
        </button>
      </div>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message">
            <strong>{message.username}: </strong>
            <span>{message.content}</span>
            <img 
              src={deleteIcon} 
              alt="Delete" 
              onClick={() => handleDelete(message.id)} 
              className="delete-button"
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="message-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}

export default Chat;
