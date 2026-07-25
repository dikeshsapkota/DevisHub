import { Router } from 'express';
import { toggleFollowUser } from '../controllers/connectionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/:targetUserId', authenticateToken, toggleFollowUser);

export default router;
