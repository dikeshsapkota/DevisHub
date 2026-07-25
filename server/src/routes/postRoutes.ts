import { Router } from 'express';
import { getPosts, createPost, reactToPost, addComment, toggleSavePost } from '../controllers/postController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getPosts);
router.post('/', authenticateToken, createPost);
router.post('/:id/react', authenticateToken, reactToPost);
router.post('/:id/comments', authenticateToken, addComment);
router.post('/:id/save', authenticateToken, toggleSavePost);

export default router;
