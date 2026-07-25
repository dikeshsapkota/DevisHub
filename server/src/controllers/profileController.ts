import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { profileUpdateSchema } from '../validators/schemas.js';

export const getProfileByUsername = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username } = req.params;

    const user = await prisma.user.findUnique({
      where: { username: username.toLowerCase() },
      include: {
        profile: {
          include: {
            skills: { include: { skill: true } },
            experiences: { orderBy: { startDate: 'desc' } },
            educations: { orderBy: { startDate: 'desc' } },
            socialLinks: true,
          },
        },
        projects: {
          where: { visibility: 'PUBLIC' },
          include: {
            technologies: true,
            stars: true,
          },
          orderBy: { createdAt: 'desc' },
        },
        posts: {
          include: {
            media: true,
            reactions: true,
            comments: true,
            tags: { include: { tag: true } },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
        followers: { select: { followerId: true } },
        following: { select: { followingId: true } },
      },
    });

    if (!user) return sendError(res, 'Developer profile not found', 404);

    let isFollowing = false;
    let isConnected = false;

    if (req.user) {
      isFollowing = user.followers.some((f) => f.followerId === req.user?.userId);
      const connection = await prisma.connection.findFirst({
        where: {
          OR: [
            { senderId: req.user.userId, receiverId: user.id },
            { senderId: user.id, receiverId: req.user.userId },
          ],
        },
      });
      isConnected = connection?.status === 'ACCEPTED';
    }

    return sendSuccess(res, {
      ...user,
      isFollowing,
      isConnected,
      followersCount: user.followers.length,
      followingCount: user.following.length,
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const updateProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const validated = profileUpdateSchema.parse(req.body);

    let profile = await prisma.profile.findUnique({ where: { userId: req.user.userId } });

    if (!profile) {
      profile = await prisma.profile.create({
        data: {
          userId: req.user.userId,
          ...validated,
        },
      });
    } else {
      profile = await prisma.profile.update({
        where: { userId: req.user.userId },
        data: validated,
      });
    }

    // Calculate profile completion percentage
    let score = 30;
    if (profile.headline) score += 15;
    if (profile.bio) score += 15;
    if (profile.location) score += 10;
    if (profile.readmeMarkdown) score += 30;

    profile = await prisma.profile.update({
      where: { userId: req.user.userId },
      data: { completionPercentage: Math.min(100, score) },
    });

    return sendSuccess(res, profile, 'Profile updated successfully');
  } catch (err: any) {
    return sendError(res, err.message, 400);
  }
};

export const addSkill = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { name, category, yearsOfExp } = req.body;

    if (!name) return sendError(res, 'Skill name is required', 400);

    const profile = await prisma.profile.findUnique({ where: { userId: req.user.userId } });
    if (!profile) return sendError(res, 'Profile not found', 404);

    let skill = await prisma.skill.findUnique({ where: { name: name.trim() } });
    if (!skill) {
      skill = await prisma.skill.create({
        data: { name: name.trim(), category: category || 'Technology' },
      });
    }

    const userSkill = await prisma.userSkill.upsert({
      where: {
        profileId_skillId: {
          profileId: profile.id,
          skillId: skill.id,
        },
      },
      update: { yearsOfExp: yearsOfExp || 1 },
      create: {
        profileId: profile.id,
        skillId: skill.id,
        yearsOfExp: yearsOfExp || 1,
      },
      include: { skill: true },
    });

    return sendSuccess(res, userSkill, 'Skill added');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
