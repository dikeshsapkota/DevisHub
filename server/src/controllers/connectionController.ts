import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';

export const toggleFollowUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { targetUserId } = req.params;

    if (targetUserId === req.user.userId) {
      return sendError(res, 'You cannot follow yourself', 400);
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: req.user.userId,
          followingId: targetUserId,
        },
      },
    });

    if (existing) {
      await prisma.follow.delete({ where: { id: existing.id } });
      return sendSuccess(res, { isFollowing: false }, 'Unfollowed developer');
    } else {
      await prisma.follow.create({
        data: {
          followerId: req.user.userId,
          followingId: targetUserId,
        },
      });

      await prisma.notification.create({
        data: {
          userId: targetUserId,
          type: 'FOLLOW',
          title: 'New Follower',
          message: `@${req.user.username} started following you.`,
          linkUrl: `/profile/${req.user.username}`,
        },
      });

      return sendSuccess(res, { isFollowing: true }, 'Followed developer');
    }
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
