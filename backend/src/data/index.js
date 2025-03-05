// In-memory storage for users and messages
const store = {
  users: new Map(),
  messages: [],
};

// User methods
export const userService = {
  createUser: (username, hashedPassword) => {
    console.log('Data layer: Creating user:', { username });

    if (store.users.has(username)) {
      console.log('Data layer: Username already exists');
      throw new Error('Username already exists');
    }

    store.users.set(username, { username, password: hashedPassword });
    console.log('Data layer: User created successfully');
    console.log('Data layer: Current users:', Array.from(store.users.keys()));

    return { username };
  },

  getUser: (username) => {
    console.log('Data layer: Getting user:', { username });
    const user = store.users.get(username);
    console.log('Data layer: User found:', !!user);
    return user;
  },

};

// Message methods
export const messageService = {
  addMessage: (username, content) => {
    const message = {
      id: Date.now(),
      username,
      content,
      timestamp: new Date().toISOString()
    };
    store.messages.push(message);
    return message;
  },

  getMessages: (limit = 50) => {
    return store.messages.slice(-limit);
  },

  // TODO: Give it to students as optional!
  deleteMessage: (messageId) => {
    const index = store.messages.findIndex(msg => msg.id === messageId);
    if (index !== -1) {
      store.messages.splice(index, 1);
      return true;
    }
    return false;
  }
};

export default store;
