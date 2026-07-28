import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt.js';
import { sendSuccess, sendError } from '../utils/response.js';
import { registerSchema, loginSchema } from '../validators/schemas.js';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { clearAuthCookies, setAccessTokenCookie, setAuthCookies } from '../utils/authCookies.js';

export const register = async (req: Request, res: Response) => {
  try {
    const validated = registerSchema.parse(req.body);

    const existingEmail = await prisma.user.findUnique({ where: { email: validated.email } });
    if (existingEmail) return sendError(res, 'Email already in use', 400);

    const existingUsername = await prisma.user.findUnique({ where: { username: validated.username } });
    if (existingUsername) return sendError(res, 'Username already in use', 400);

    const passwordHash = await bcrypt.hash(validated.password, 10);

    const user = await prisma.user.create({
      data: {
        name: validated.name,
        username: validated.username.toLowerCase(),
        email: validated.email.toLowerCase(),
        passwordHash,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${validated.username}`,
        status: 'ONLINE',
        isOnboarded: true,
        profile: {
          create: {
            headline: 'Software Engineer @ DevisHub',
            bio: 'Welcome to my DevisHub profile! Passionate about building modern full-stack web applications.',
            completionPercentage: 50,
          },
        },
      },
      include: { profile: true },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

    return sendSuccess(res, { user, accessToken, refreshToken }, 'Account created successfully', 201);
  } catch (err: any) {
    if (err.errors) {
      return sendError(res, err.errors[0].message, 400);
    }
    return sendError(res, err.message || 'Registration failed', 500);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validated = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: validated.email.toLowerCase() },
      include: { profile: true },
    });

    if (!user || !user.passwordHash) {
      return sendError(res, 'Invalid email or password', 401);
    }

    const isValidPassword = await bcrypt.compare(validated.password, user.passwordHash);
    if (!isValidPassword) {
      return sendError(res, 'Invalid email or password', 401);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ONLINE' },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    setAuthCookies(res, accessToken, refreshToken);

    return sendSuccess(res, { user, accessToken, refreshToken }, 'Logged in successfully');
  } catch (err: any) {
    if (err.errors) {
      return sendError(res, err.errors[0].message, 400);
    }
    return sendError(res, err.message || 'Login failed', 500);
  }
};

export const demoLogin = async (req: Request, res: Response) => {
  try {
    const username = (req.body.username || 'alex_dev').toLowerCase();
    let user =
      username === 'admin_demo'
        ? await prisma.user.upsert({
            where: { username: 'admin_demo' },
            update: {
              role: 'ADMIN',
              status: 'ONLINE',
              isVerified: true,
              isOnboarded: true,
            },
            create: {
              name: 'Demo Admin',
              username: 'admin_demo',
              email: 'admin@devishub.io',
              role: 'ADMIN',
              avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin_demo',
              status: 'ONLINE',
              isVerified: true,
              isOnboarded: true,
              profile: {
                create: {
                  headline: 'Platform Administrator @ DevisHub',
                  bio: 'Demo administrator account for reviewing privileged flows.',
                  completionPercentage: 80,
                },
              },
            },
            include: { profile: true },
          })
        : await prisma.user.findUnique({
            where: { username },
            include: { profile: true },
          });

    if (!user) {
      user = await prisma.user.findFirst({
        include: { profile: true },
      });
    }

    if (!user) {
      return sendError(res, 'No seed users available. Run seed script first.', 404);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { status: 'ONLINE' },
    });

    const tokenPayload = {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    setAuthCookies(res, accessToken, refreshToken);

    return sendSuccess(res, { user, accessToken, refreshToken }, `Logged in as demo user ${user.username}`);
  } catch (err: any) {
    return sendError(res, err.message || 'Demo login failed', 500);
  }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return sendError(res, 'Not authenticated', 401);

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      include: {
        profile: {
          include: {
            skills: { include: { skill: true } },
            experiences: true,
            educations: true,
            socialLinks: true,
          },
        },
      },
    });

    if (!user) return sendError(res, 'User not found', 404);

    return sendSuccess(res, user);
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.user?.userId) {
      await prisma.user.update({
        where: { id: req.user.userId },
        data: { status: 'OFFLINE' },
      });
    }

    clearAuthCookies(res);

    return sendSuccess(res, null, 'Logged out successfully');
  } catch (err: any) {
    return sendError(res, err.message, 500);
  }
};

export const refresh = async (req: Request, res: Response) => {
  const token = req.cookies.refreshToken || req.body.refreshToken;
  if (!token) return sendError(res, 'Refresh token is required', 401);

  const payload = verifyRefreshToken(token);
  if (!payload) return sendError(res, 'Refresh token is invalid or expired', 401);

  const storedToken = await prisma.refreshToken.findUnique({ where: { token } });
  if (!storedToken || storedToken.expiresAt <= new Date()) {
    return sendError(res, 'Refresh token has expired', 401);
  }

  const accessToken = generateAccessToken(payload);
  setAccessTokenCookie(res, accessToken);
  return sendSuccess(res, { accessToken }, 'Access token refreshed');
};
