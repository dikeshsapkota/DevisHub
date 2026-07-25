import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  availability: z.string().optional(),
  currentRole: z.string().optional(),
  openToCollaboration: z.boolean().optional(),
  readmeMarkdown: z.string().optional(),
});

export const projectCreateSchema = z.object({
  name: z.string().min(2, 'Project name is required'),
  shortDescription: z.string().min(10, 'Short description must be at least 10 characters'),
  fullDescription: z.string().optional(),
  repoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  demoUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  docUrl: z.string().url('Invalid URL').or(z.literal('')).optional(),
  status: z.enum(['PLANNING', 'IN_DEVELOPMENT', 'BETA', 'COMPLETED', 'MAINTAINED', 'ARCHIVED']).optional(),
  visibility: z.enum(['PUBLIC', 'PRIVATE', 'UNLISTED']).optional(),
  license: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  readmeContent: z.string().optional(),
});

export const postCreateSchema = z.object({
  content: z.string().min(1, 'Post content cannot be empty'),
  type: z.enum(['TEXT', 'CODE_SNIPPET', 'PROJECT_UPDATE', 'QUESTION', 'POLL', 'ACHIEVEMENT', 'COLLABORATION', 'OPPORTUNITY']).optional(),
  projectId: z.string().optional(),
  codeSnippet: z.string().optional(),
  codeLang: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const commentCreateSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
  parentId: z.string().optional(),
});
