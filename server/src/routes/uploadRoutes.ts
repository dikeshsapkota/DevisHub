import { Router, Response } from 'express';
import { uploadMiddleware } from '../middleware/upload.js';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth.js';
import { sendSuccess, sendError } from '../utils/response.js';

const router = Router();

router.post('/', authenticateToken, uploadMiddleware.single('file'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) return sendError(res, 'No file uploaded', 400);

    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    return sendSuccess(res, { url: fileUrl, filename: req.file.filename, mimetype: req.file.mimetype }, 'File uploaded successfully');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
});

export default router;
