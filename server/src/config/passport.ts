import dotenv from 'dotenv';
import passport from 'passport';
import { Strategy as GoogleStrategy, type Profile as GoogleProfile } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy, type Profile as GitHubProfile } from 'passport-github2';
import { prisma } from './prisma.js';

dotenv.config();

type OAuthProfile = GoogleProfile | GitHubProfile;

async function resolveUser(provider: 'google' | 'github', profile: OAuthProfile) {
  const account = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider,
        providerAccountId: profile.id,
      },
    },
    include: { user: { include: { profile: true } } },
  });
  if (account) return account.user;

  const email = profile.emails?.[0]?.value.toLowerCase();
  if (!email) throw new Error(`${provider} did not provide an email address`);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    await prisma.account.create({
      data: { userId: existing.id, provider, providerAccountId: profile.id },
    });
    return prisma.user.findUniqueOrThrow({
      where: { id: existing.id },
      include: { profile: true },
    });
  }

  const base = (profile.username || email.split('@')[0]).replace(/[^a-zA-Z0-9_]/g, '').slice(0, 24);
  let username = base || `${provider}_user`;
  let suffix = 1;
  while (await prisma.user.findUnique({ where: { username } })) {
    username = `${base}_${suffix++}`;
  }

  return prisma.user.create({
    data: {
      email,
      username,
      name: profile.displayName || username,
      avatarUrl: profile.photos?.[0]?.value,
      isVerified: true,
      isOnboarded: true,
      status: 'ONLINE',
      accounts: { create: { provider, providerAccountId: profile.id } },
      profile: { create: { headline: 'Developer on DevisHub', completionPercentage: 40 } },
    },
    include: { profile: true },
  });
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${process.env.OAUTH_CALLBACK_URL || 'http://localhost:5000'}/api/auth/oauth/google/callback`,
      },
      (_accessToken, _refreshToken, profile, done) => {
        void resolveUser('google', profile)
          .then((user) =>
            done(null, {
              id: user.id,
              userId: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
            })
          )
          .catch(done);
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${process.env.OAUTH_CALLBACK_URL || 'http://localhost:5000'}/api/auth/oauth/github/callback`,
        scope: ['user:email'],
      },
      (_accessToken: string, _refreshToken: string, profile: GitHubProfile, done: (error: unknown, user?: Express.User | false) => void) => {
        void resolveUser('github', profile)
          .then((user) =>
            done(null, {
              id: user.id,
              userId: user.id,
              email: user.email,
              username: user.username,
              role: user.role,
            })
          )
          .catch(done);
      }
    )
  );
}
