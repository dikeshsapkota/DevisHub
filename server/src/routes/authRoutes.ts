import { Router } from 'express';
import { register, login, demoLogin, getCurrentUser, logout, refresh } from '../controllers/authController.js';
import { beginOAuth, completeOAuth } from '../controllers/oauthController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/demo-login', demoLogin);
router.get('/me', authenticateToken, getCurrentUser);
router.post('/logout', authenticateToken, logout);
router.post('/refresh', refresh);
router.get('/oauth/:provider', beginOAuth);
router.get('/oauth/:provider/callback', completeOAuth);

export default router;
