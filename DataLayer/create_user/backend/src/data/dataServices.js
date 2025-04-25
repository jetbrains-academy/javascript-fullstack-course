// In-memory storage
export const store = {
    users: new Map(),
};

export const userService = {
    createUser: async (username, hashedPassword) => {
        // You can add debug outputs if you need this way:
        console.log('Data layer: Creating user:', {username});

        if (store.users.has(username)) {
            throw new Error('Username already exists');
        }

        store.users.set(username, {username, password: hashedPassword});
        return {username};
    },

    getUser: async (username) => {
        return store.users.get(username);
    },

};
