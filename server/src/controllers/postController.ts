import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { postCreateSchema, commentCreateSchema } from '../validators/schemas.js';

export const getPosts = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { filter, type, tag } = req.query;

    const whereClause: any = {};

    if (type) {
      whereClause.type = type as string;
    }

    if (tag) {
      whereClause.tags = {
        some: { tag: { name: tag as string } },
      };
    }

    if (filter === 'following' && req.user) {
      const following = await prisma.follow.findMany({
        where: { followerId: req.user.userId },
        select: { followingId: true },
      });
      const ids = following.map((f) => f.followingId);
      ids.push(req.user.userId);
      whereClause.authorId = { in: ids };
    } else if (filter === 'projects') {
      whereClause.projectId = { not: null };
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            profile: { select: { headline: true } },
          },
        },
        project: {
          select: {
            id: true,
            name: true,
            slug: true,
            shortDescription: true,
            logoUrl: true,
          },
        },
        media: true,
        reactions: true,
        comments: {
          include: {
            author: { select: { name: true, username: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
          take: 5,
        },
        saves: true,
        tags: { include: { tag: true } },
        _count: { select: { reactions: true, comments: true, saves: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    const formattedPosts = posts.map((post) => {
      let userReaction: string | null = null;
      let isSaved = false;

      if (req.user) {
        const found = post.reactions.find((r) => r.userId === req.user?.userId);
        if (found) userReaction = found.type;
        isSaved = post.saves.some((s) => s.userId === req.user?.userId);
      }

      return {
        ...post,
        userReaction,
        isSaved,
      };
    });

    return sendSuccess(res, formattedPosts);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const validated = postCreateSchema.parse(req.body);

    const post = await prisma.post.create({
      data: {
        authorId: req.user.userId,
        content: validated.content,
        type: validated.type || 'TEXT',
        projectId: validated.projectId || null,
        codeSnippet: validated.codeSnippet || null,
        codeLang: validated.codeLang || 'typescript',
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
        project: true,
        reactions: true,
        comments: true,
      },
    });

    return sendSuccess(res, post, 'Post published successfully', 201);
  } catch (err: any) {
    if (err.errors) return sendError(res, err.errors[0].message, 400);
    return sendError(res, err.message, 500);
  }
};

export const reactToPost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const { type = 'LIKE' } = req.body;

    const existingReaction = await prisma.reaction.findFirst({
      where: {
        postId: id,
        userId: req.user.userId,
      },
    });

    if (existingReaction) {
      if (existingReaction.type === type) {
        await prisma.reaction.delete({ where: { id: existingReaction.id } });
        return sendSuccess(res, { reaction: null }, 'Reaction removed');
      } else {
        const updated = await prisma.reaction.update({
          where: { id: existingReaction.id },
          data: { type: type as any },
        });
        return sendSuccess(res, { reaction: updated.type }, 'Reaction updated');
      }
    } else {
      const created = await prisma.reaction.create({
        data: {
          postId: id,
          userId: req.user.userId,
          type: type as any,
        },
      });

      // Send notification to post author if not self
      const post = await prisma.post.findUnique({ where: { id } });
      if (post && post.authorId !== req.user.userId) {
        await prisma.notification.create({
          data: {
            userId: post.authorId,
            type: 'POST_REACTION',
            title: 'New Reaction',
            message: `@${req.user.username} reacted with ${type} to your post.`,
            linkUrl: `/feed#post-${post.id}`,
          },
        });
      }

      return sendSuccess(res, { reaction: created.type }, 'Reaction added');
    }
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const addComment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;
    const validated = commentCreateSchema.parse(req.body);

    const comment = await prisma.comment.create({
      data: {
        postId: id,
        authorId: req.user.userId,
        content: validated.content,
        parentId: validated.parentId || null,
      },
      include: {
        author: {
          select: { id: true, name: true, username: true, avatarUrl: true },
        },
      },
    });

    const post = await prisma.post.findUnique({ where: { id } });
    if (post && post.authorId !== req.user.userId) {
      await prisma.notification.create({
        data: {
          userId: post.authorId,
          type: 'POST_COMMENT',
          title: 'New Comment',
          message: `@${req.user.username} commented on your post.`,
          linkUrl: `/feed#post-${post.id}`,
        },
      });
    }

    return sendSuccess(res, comment, 'Comment added', 201);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const toggleSavePost = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const { id } = req.params;

    const existing = await prisma.savedPost.findUnique({
      where: {
        postId_userId: {
          postId: id,
          userId: req.user.userId,
        },
      },
    });

    if (existing) {
      await prisma.savedPost.delete({ where: { id: existing.id } });
      return sendSuccess(res, { isSaved: false }, 'Post unsaved');
    } else {
      await prisma.savedPost.create({
        data: {
          postId: id,
          userId: req.user.userId,
        },
      });
      return sendSuccess(res, { isSaved: true }, 'Post saved');
    }
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
