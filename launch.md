# Real-Time Chat Application

A full-stack real-time chat application built with React, Express.js, and Socket.IO.

## Features

- Real-time messaging using WebSocket (Socket.IO)
- User authentication with JWT
- Message history
- Responsive design
- RESTful API endpoints
- In-memory data storage (prepared for database integration)

## Tech Stack

### Frontend
- React (Vite)
- React Router for navigation
- Socket.IO client for real-time communication
- Axios for API requests
- Modern CSS with responsive design

### Backend
- Express.js
- Socket.IO for WebSocket support
- JWT for authentication
- In-memory data storage
- Jest for testing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm

### Installation

1. Install dependencies
```bash
npm run install:all
```

2. Configure environment variables
- Copy `.env.example` to `.env` in the backend directory
- Generate a secure JWT secret:
  ```bash
  cd backend
  npm run generate-secret
  ```
- Update `.env` with the generated secret and other variables
- See `backend/docs/jwt-secret-guide.md` for JWT security best practices

### Development

Run both frontend and backend in development mode:
```bash
npm run dev
```

Or run them separately:
- Frontend: `cd frontend && npm run dev`
- Backend: `cd backend && npm run dev`

### Educational frontend

Run both educational frontend and backend in development mode:
```bash
npm run dev:edu
```

### Testing

Run backend tests:
```bash
npm test
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Messages
- `GET /api/messages` - Get message history
- `POST /api/messages` - Create a new message
- `DELETE /api/messages/:id` - Delete a message

## WebSocket Events

### Client -> Server
- `message` - Send a new message
  ```js
  socket.emit('message', { content: 'Hello!' })
  ```

### Server -> Client
- `message` - Receive a new message
  ```js
  socket.on('message', (message) => {
    console.log(message)
    // { id, content, username, timestamp }
  })
  ```

