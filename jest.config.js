export default {
    // Tell Jest to map the #utils/* alias
    moduleNameMapper: {
        '^#utils/(.*)$': '<rootDir>/utils/$1',
    },

    // Other configurations
    transform: {}, // Use an empty transform to skip Babel if you're not using Babel
};