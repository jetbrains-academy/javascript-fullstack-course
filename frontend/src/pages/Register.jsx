import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function Register({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({
    password: [],
    confirmPassword: ''
  });
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Real-time validation
    if (name === 'password') {
      const errors = validatePassword(value);
      setValidationErrors(prev => ({
        ...prev,
        password: errors,
        confirmPassword: value !== formData.confirmPassword ? 'Passwords do not match' : ''
      }));
    }

    if (name === 'confirmPassword') {
      setValidationErrors(prev => ({
        ...prev,
        confirmPassword: value !== formData.password ? 'Passwords do not match' : ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validate password requirements
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      setError(passwordErrors[0]);
      setIsLoading(false);
      return;
    }

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      console.log('Attempting registration with:', { username: formData.username });
      const response = await axios.post('/api/auth/register', {
        username: formData.username,
        password: formData.password
      });

      console.log('Registration response:', response.data);
      localStorage.setItem('token', response.data.token);
      onLogin();
      navigate('/chat');
    } catch (err) {
      console.error('Registration error:', err.response || err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="login-form">
        <h2>Register for Chat</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="3"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
            {validationErrors.password.length > 0 && (
              <ul className="validation-errors">
                {validationErrors.password.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            {validationErrors.confirmPassword && (
              <div className="validation-error">{validationErrors.confirmPassword}</div>
            )}
          </div>
          <button 
            type="submit" 
            disabled={
              isLoading || 
              validationErrors.password.length > 0 || 
              validationErrors.confirmPassword !== '' ||
              !formData.username ||
              !formData.password ||
              !formData.confirmPassword
            }
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
          <p className="form-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
