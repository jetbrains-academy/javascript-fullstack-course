module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.cjs',
    '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.cjs'
  },
  transform: {
    '^.+\\.(js|jsx)$': ['babel-jest', { configFile: './babel.config.cjs' }]
  },
  testMatch: [
    "**/__test__/**/*.jest.test.[jt]s?(x)"
  ]
};
