import axios from 'axios';

const getErrorMessage = (error: unknown): string => {
  if (typeof error === 'string' && error.trim()) return error;

  if (Array.isArray(error)) {
    const firstMessage = error.find(
      (item): item is { message?: unknown } =>
        typeof item === 'object' && item !== null && typeof (item as { message?: unknown }).message === 'string'
    )?.message;

    if (typeof firstMessage === 'string' && firstMessage.trim()) return firstMessage;
  }

  if (typeof error === 'object' && error !== null) {
    const message = (error as { message?: unknown }).message;
    if (typeof message === 'string' && message.trim()) return message;
  }

  return 'An unexpected error occurred';
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
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
