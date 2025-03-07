import { Sequelize, DataTypes } from 'sequelize';

const { User, Message } = await (async () => {
  // Initialize Sequelize with SQLite
  const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './database.sqlite',
    logging: false
  });

  // Define User model
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  // Define Message model
  const Message = sequelize.define('Message', {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false
    }
  });

  await sequelize.sync();
  return { User, Message };
})();

// User methods
export const userService = {
  createUser: async (username, hashedPassword) => {
    console.log('Data layer: Creating user:', { username });

    const existingUser = await User.findByPk(username);
    if (existingUser) {
      console.log('Data layer: Username already exists');
      throw new Error('Username already exists');
    }

    await User.create({ username, password: hashedPassword });
    console.log('Data layer: User created successfully');
    const users = await User.findAll();
    console.log('Data layer: Current users:', users.map(u => u.username));

    return { username };
  },

  getUser: async (username) => {
    console.log('Data layer: Getting user:', { username });
    const user = await User.findByPk(username);
    console.log('Data layer: User found:', !!user);
    return user ? user.get({ plain: true }) : null;
  },
};

// Message methods
export const messageService = {
  addMessage: async (username, content) => {
    const timestamp = new Date();
    const message = await Message.create({
      username,
      content,
      timestamp
    });
    return message.get({ plain: true });
  },

  getMessages: async (limit = 50) => {
    const messages = await Message.findAll({
      order: [['id', 'DESC']],
      limit: limit
    });
    return messages.map(msg => msg.get({ plain: true })).reverse();
  },

  deleteMessage: async (messageId) => {
    const deleted = await Message.destroy({
      where: { id: messageId }
    });
    return deleted > 0;
  }
};

// For backward compatibility
export default {
  users: new Map(),
  messages: []
};
