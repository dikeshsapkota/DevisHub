import { Router } from 'express';
import { getProfileByUsername, updateProfile, addSkill } from '../controllers/profileController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/:username', optionalAuth, getProfileByUsername);
router.put('/me', authenticateToken, updateProfile);
router.post('/skills', authenticateToken, addSkill);

export default router;
