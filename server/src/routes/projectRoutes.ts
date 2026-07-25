import { Router } from 'express';
import { getProjects, getProjectBySlug, createProject, toggleStarProject } from '../controllers/projectController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getProjects);
router.get('/:slug', optionalAuth, getProjectBySlug);
router.post('/', authenticateToken, createProject);
router.post('/:id/star', authenticateToken, toggleStarProject);

export default router;
