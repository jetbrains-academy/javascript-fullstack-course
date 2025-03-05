import express from 'express';
import { messageService } from '../data/index.js';

const router = express.Router();

// Get all messages
router.get('/', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const messages = messageService.getMessages(limit);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
});

// Create a new message
router.post('/', (req, res) => {
  try {
    const { content/*, username */} = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // if (!username) {
    //   return res.status(400).json({ message: 'Username is required' });
    // }

    const message = messageService.addMessage(req.user.username, content);
    // const message = messageService.addMessage(username, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error creating message' });
  }
});

// Delete a message
// TODO: Give it to students as optional!
router.delete('/:id', (req, res) => {
  try {
    const messageId = parseInt(req.params.id);
    const deleted = messageService.deleteMessage(messageId);

    if (!deleted) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message' });
  }
});

export default router;