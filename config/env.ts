/**
 * Environment Configuration
 * Centralized access to environment variables with validation
 */

const getEnvVar = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const ENV = {
  API_BASE_URL: getEnvVar(process.env.EXPO_PUBLIC_API_BASE_URL, 'EXPO_PUBLIC_API_BASE_URL'),
  ENCRYPTION_KEY: getEnvVar(process.env.EXPO_PUBLIC_ENCRYPTION_KEY, 'EXPO_PUBLIC_ENCRYPTION_KEY'),
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/login-mobile-app',
  LOGOUT: '/logout',

} as const;
