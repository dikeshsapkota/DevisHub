import axios from 'axios';

const normalizeApiBaseUrl = (value?: string) => {
  const baseUrl = value?.trim();
  if (!baseUrl) return '/api';

  const withoutTrailingSlash = baseUrl.replace(/\/+$/, '');
  return withoutTrailingSlash.endsWith('/api') ? withoutTrailingSlash : `${withoutTrailingSlash}/api`;
};

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) return error;

  if (Array.isArray(error)) {
    const firstMessage = error.map(getErrorMessage).find((message) => message !== 'An unexpected error occurred');
    if (firstMessage) return firstMessage;
  }

  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
    if (message) return getErrorMessage(message);

    const errorText = (error as { error?: unknown }).error;
    if (errorText) return getErrorMessage(errorText);

    const issues = (error as { issues?: unknown }).issues;
    if (issues) return getErrorMessage(issues);

    const fieldErrors = (error as { fieldErrors?: Record<string, unknown> }).fieldErrors;
    if (fieldErrors) {
      const firstFieldError = Object.values(fieldErrors).flat().find(Boolean);
      if (firstFieldError) return getErrorMessage(firstFieldError);
    }
  }

  return 'An unexpected error occurred';
};

export const api = axios.create({
  baseURL: normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = getErrorMessage(error.response?.data?.error ?? error.message);
    return Promise.reject(new Error(message));
  }
);
