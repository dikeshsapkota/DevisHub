import { Request, Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';

export const globalSearch = async (req: Request, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();

    if (!q) {
      return sendSuccess(res, { users: [], projects: [], posts: [], tags: [] });
    }

    const [users, projects, posts] = await Promise.all([
      prisma.user.findMany({
        where: {
          OR: [
            { name: { contains: q } },
            { username: { contains: q } },
            { profile: { headline: { contains: q } } },
          ],
        },
        select: {
          id: true,
          name: true,
          username: true,
          avatarUrl: true,
          status: true,
          profile: { select: { headline: true, location: true } },
        },
        take: 8,
      }),

      prisma.project.findMany({
        where: {
          visibility: 'PUBLIC',
          OR: [
            { name: { contains: q } },
            { shortDescription: { contains: q } },
            { technologies: { some: { name: { contains: q } } } },
          ],
        },
        include: {
          owner: { select: { name: true, username: true, avatarUrl: true } },
          technologies: true,
        },
        take: 8,
      }),

      prisma.post.findMany({
        where: {
          OR: [
            { content: { contains: q } },
            { codeSnippet: { contains: q } },
          ],
        },
        include: {
          author: { select: { name: true, username: true, avatarUrl: true } },
          reactions: true,
          comments: true,
        },
        take: 8,
      }),
    ]);

    return sendSuccess(res, { users, projects, posts });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
