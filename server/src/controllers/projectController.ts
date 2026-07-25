import { Response } from 'express';
import { prisma } from '../config/prisma.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { projectCreateSchema } from '../validators/schemas.js';

export const getProjects = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, tech, search } = req.query;

    const whereClause: any = { visibility: 'PUBLIC' };

    if (status) {
      whereClause.status = status as string;
    }

    if (search) {
      whereClause.OR = [
        { name: { contains: search as string } },
        { shortDescription: { contains: search as string } },
      ];
    }

    if (tech) {
      whereClause.technologies = {
        some: { name: { contains: tech as string } },
      };
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
          },
        },
        technologies: true,
        stars: true,
        saves: true,
        _count: { select: { stars: true, saves: true, posts: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return sendSuccess(res, projects);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const getProjectBySlug = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { slug } = req.params;

    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarUrl: true,
            profile: { select: { headline: true } },
          },
        },
        technologies: true,
        contributors: { include: { user: true } },
        documents: { orderBy: { isPrimary: 'desc' } },
        media: true,
        stars: true,
        saves: true,
        posts: {
          include: {
            author: { select: { name: true, username: true, avatarUrl: true } },
            reactions: true,
            comments: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!project) return sendError(res, 'Project not found', 404);

    // Increment view count asynchronously
    await prisma.project.update({
      where: { id: project.id },
      data: { viewCount: { increment: 1 } },
    });

    let isStarred = false;
    let isSaved = false;

    if (req.user) {
      isStarred = project.stars.some((s) => s.userId === req.user?.userId);
      isSaved = project.saves.some((s) => s.userId === req.user?.userId);
    }

    return sendSuccess(res, {
      ...project,
      isStarred,
      isSaved,
      starsCount: project.stars.length,
      savesCount: project.saves.length,
    });
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const createProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);

    const validated = projectCreateSchema.parse(req.body);

    const slug = validated.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const project = await prisma.project.create({
      data: {
        ownerId: req.user.userId,
        name: validated.name,
        slug,
        shortDescription: validated.shortDescription,
        fullDescription: validated.fullDescription,
        repoUrl: validated.repoUrl,
        demoUrl: validated.demoUrl,
        docUrl: validated.docUrl,
        status: validated.status || 'IN_DEVELOPMENT',
        visibility: validated.visibility || 'PUBLIC',
        license: validated.license || 'MIT',
        logoUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${slug}`,
        coverImageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&auto=format&fit=crop',
        technologies: {
          create: (validated.technologies || ['TypeScript', 'React', 'Node.js']).map((tech) => ({
            name: tech,
          })),
        },
        documents: {
          create: [
            {
              title: 'README',
              slug: 'readme',
              content: validated.readmeContent || `# ${validated.name}\n\n${validated.shortDescription}\n\n## Getting Started\n\`\`\`bash\n# Clone the repository\ngit clone ${validated.repoUrl || 'https://github.com/example/repo.git'}\n\n# Install dependencies\nnpm install\n\n# Start dev server\nnpm run dev\n\`\`\``,
              isPrimary: true,
            },
          ],
        },
      },
      include: {
        technologies: true,
        documents: true,
      },
    });

    return sendSuccess(res, project, 'Project created successfully', 201);
  } catch (err: any) {
    if (err.errors) return sendError(res, err.errors[0].message, 400);
    return sendError(res, err.message, 500);
  }
};

export const toggleStarProject = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Unauthorized', 401);
    const { id } = req.params;

    const existing = await prisma.projectStar.findUnique({
      where: {
        projectId_userId: {
          projectId: id,
          userId: req.user.userId,
        },
      },
    });

    if (existing) {
      await prisma.projectStar.delete({ where: { id: existing.id } });
      return sendSuccess(res, { starred: false }, 'Project unstarred');
    } else {
      await prisma.projectStar.create({
        data: {
          projectId: id,
          userId: req.user.userId,
        },
      });
      return sendSuccess(res, { starred: true }, 'Project starred');
    }
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};
