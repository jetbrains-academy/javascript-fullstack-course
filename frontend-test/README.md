# Frontend Test

A simple React frontend with a single field for messages.

## Features

- Single input field for messages
- Real-time display of entered message
- Responsive design

## Project Structure

```
frontend-test/
├── __mocks__/          # Mock files for Jest
├── __test__/           # Test files
├── public/             # Static assets
├── src/                # Source code
│   ├── App.jsx         # Main component
│   ├── App.css         # Component styles
│   ├── main.jsx        # Entry point
│   ├── index.css       # Global styles
│   └── setupTests.js   # Test setup
├── babel.config.js     # Babel configuration for Jest
├── index.html          # HTML template
├── jest.config.js      # Jest configuration
├── package.json        # Dependencies and scripts
├── vite.config.js      # Vite configuration
└── README.md           # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

```bash
# From the project root
npm run install:all

# Or directly in the frontend-test directory
cd frontend-test
npm install
```

### Development

```bash
# From the project root
npm run dev:test

# Or directly in the frontend-test directory
cd frontend-test
npm run dev
```

### Testing

#### Vitest (Default)

```bash
# From the project root
npm run test:frontend-test

# Or directly in the frontend-test directory
cd frontend-test
npm test
```

#### Jest

```bash
# From the project root
npm run test:frontend-test:jest

# Or directly in the frontend-test directory
cd frontend-test
npm run test:jest
```

## Testing

Tests are located in the `__test__` directory and use both Vitest and Jest with React Testing Library:

- `App.test.jsx` - Vitest tests
- `App.jest.test.jsx` - Jest tests

Both test suites cover the same functionality:

1. Component rendering
2. Input field functionality
3. Message display logic
4. Conditional rendering

The project demonstrates how to set up and run tests using both testing frameworks.
