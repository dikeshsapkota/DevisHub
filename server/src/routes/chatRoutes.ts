import { Router } from 'express';
import { getConversations, getOrCreateConversation, getMessages, sendMessage } from '../controllers/chatController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', authenticateToken, getConversations);
router.post('/conversations', authenticateToken, getOrCreateConversation);
router.get('/conversations/:conversationId/messages', authenticateToken, getMessages);
router.post('/messages', authenticateToken, sendMessage);

export default router;
