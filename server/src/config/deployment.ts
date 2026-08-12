import type { CorsOptions } from 'cors';

const LOCAL_CLIENT_URL = 'http://localhost:5173';
const LOCAL_API_URL = 'http://localhost:5000';

const toHttpsUrl = (value?: string) => {
  if (!value) return undefined;

  const url = value.trim();

  return url.startsWith('http://') || url.startsWith('https://')
    ? url
    : `https://${url}`;
};

const splitUrls = (value?: string) =>
  value
    ?.split(',')
    .map((url) => toHttpsUrl(url))
    .filter((url): url is string => Boolean(url)) ?? [];

export const getClientUrl = () =>
  splitUrls(process.env.CLIENT_URL)[0] ||
  toHttpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  toHttpsUrl(process.env.VERCEL_URL) ||
  LOCAL_CLIENT_URL;

export const getApiUrl = () =>
  toHttpsUrl(process.env.OAUTH_CALLBACK_URL) ||
  toHttpsUrl(process.env.SERVER_URL) ||
  LOCAL_API_URL;

export const getAllowedOrigins = () =>
  Array.from(
    new Set(
      [
        LOCAL_CLIENT_URL,
        ...splitUrls(process.env.CLIENT_URL),
        toHttpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
        toHttpsUrl(process.env.VERCEL_URL),
      ].filter((url): url is string => Boolean(url))
    )
  );

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || getAllowedOrigins().includes(origin)) {
      callback(null, true);
      return;
    }

    console.error('Blocked CORS origin:', origin);
    console.error('Allowed origins:', getAllowedOrigins());

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },

  credentials: true,
};