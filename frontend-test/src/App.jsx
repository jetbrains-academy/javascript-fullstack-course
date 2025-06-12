import { useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <div className="app-container">
      <h1>Message Input</h1>
      <div className="message-container">
        <input
          type="text"
          value={message}
          onChange={handleChange}
          placeholder="Enter your message"
          aria-label="Message input"
        />
        {message && (
          <div className="message-display">
            <p>Your message: {message}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;