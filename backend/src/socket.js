import { messageService } from './data/dataServices.js';
import { authenticateSocket } from './middleware/auth.js';

export const initializeSocketIO = (io) => {
  // Add authentication middleware
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.username}`);

    // Handle new messages
    socket.on('message', async (data) => {
      try {
        const message = await messageService.addMessage(socket.user.username, data.content);

        // Broadcast the message to all connected clients
        io.emit('message', message);
      } catch (error) {
        console.error('Error handling message:', error);
        socket.emit('error', { message: 'Error sending message' });
      }
    });

    // Handle message deletion
    socket.on('deleteMessage', async (data) => {
      try {
        const messageId = parseInt(data.messageId);
        const deleted = await messageService.deleteMessage(messageId);

        if (!deleted) {
          socket.emit('error', { message: 'Message not found' });
          return;
        }

        // Broadcast the deletion to all connected clients
        io.emit('messageDeleted', { messageId });
      } catch (error) {
        console.error('Error deleting message:', error);
        socket.emit('error', { message: 'Error deleting message' });
      }
    });

    // Handle user disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.user.username}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  });

  // Handle server-side errors
  io.on('error', (error) => {
    console.error('Socket.IO error:', error);
  });
};
