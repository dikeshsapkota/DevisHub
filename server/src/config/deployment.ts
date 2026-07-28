import type { CorsOptions } from 'cors';

const LOCAL_CLIENT_URL = 'http://localhost:5173';
const LOCAL_API_URL = 'http://localhost:5000';

const toHttpsUrl = (value?: string) => {
  if (!value) return undefined;
  return value.startsWith('http://') || value.startsWith('https://') ? value : `https://${value}`;
};

const splitUrls = (value?: string) =>
  value
    ?.split(',')
    .map((url) => toHttpsUrl(url.trim()))
    .filter((url): url is string => Boolean(url)) ?? [];

export const getClientUrl = () =>
  splitUrls(process.env.CLIENT_URL)[0] ||
  toHttpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL) ||
  toHttpsUrl(process.env.VERCEL_URL) ||
  LOCAL_CLIENT_URL;

export const getApiUrl = () =>
  toHttpsUrl(process.env.OAUTH_CALLBACK_URL) ||
  toHttpsUrl(process.env.SERVER_URL) ||
  toHttpsUrl(process.env.VERCEL_URL) ||
  LOCAL_API_URL;

export const getAllowedOrigins = () =>
  Array.from(
    new Set([
      LOCAL_CLIENT_URL,
      ...splitUrls(process.env.CLIENT_URL),
      toHttpsUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL),
      toHttpsUrl(process.env.VERCEL_URL),
    ].filter((url): url is string => Boolean(url)))
  );

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || getAllowedOrigins().includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
};
