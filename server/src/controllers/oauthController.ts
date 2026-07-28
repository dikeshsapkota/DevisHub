import type { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { prisma } from '../config/prisma.js';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt.js';
import { sendError } from '../utils/response.js';
import { getClientUrl } from '../config/deployment.js';
import { setAuthCookies } from '../utils/authCookies.js';

type Provider = 'google' | 'github';

function providerFromRequest(req: Request): Provider | null {
  return req.params.provider === 'google' || req.params.provider === 'github'
    ? req.params.provider
    : null;
}

function isConfigured(provider: Provider) {
  return provider === 'google'
    ? Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    : Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
}

export function beginOAuth(req: Request, res: Response, next: NextFunction) {
  const provider = providerFromRequest(req);
  if (!provider) return sendError(res, 'Unsupported OAuth provider', 404);
  if (!isConfigured(provider)) return sendError(res, `${provider} OAuth is not configured`, 503);
  const options = provider === 'google' ? { scope: ['profile', 'email'], session: false } : { session: false };
  return passport.authenticate(provider, options)(req, res, next);
}

export function completeOAuth(req: Request, res: Response, next: NextFunction) {
  const provider = providerFromRequest(req);
  if (!provider) return sendError(res, 'Unsupported OAuth provider', 404);
  if (!isConfigured(provider)) return sendError(res, `${provider} OAuth is not configured`, 503);

  return passport.authenticate(provider, { session: false }, async (error: unknown, user: any) => {
    if (error || !user) {
      return res.redirect(`${getClientUrl()}/signin?oauth=failed`);
    }
    const payload = { userId: user.id, email: user.email, username: user.username, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
    setAuthCookies(res, accessToken, refreshToken);
    return res.redirect(`${getClientUrl()}/feed`);
  })(req, res, next);
}
