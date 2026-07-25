import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const getNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.userId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });

    const unreadCount = await prisma.notification.count({
      where: { userId: req.user.userId, isRead: false },
    });

    return sendSuccess(res, { notifications, unreadCount });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const markNotificationRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    if (id === 'all') {
      await prisma.notification.updateMany({
        where: { userId: req.user.userId, isRead: false },
        data: { isRead: true },
      });
      return sendSuccess(res, null, 'All notifications marked as read');
    }

    await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    return sendSuccess(res, null, 'Notification marked as read');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
