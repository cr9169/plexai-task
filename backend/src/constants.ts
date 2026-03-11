export const APP_PREFIX = 'api';

export const ENV_KEYS = {
  PORT: 'PORT',
  CORS_ORIGIN: 'CORS_ORIGIN',
  ANTHROPIC_API_KEY: 'ANTHROPIC_API_KEY',
} as const;

export const DEFAULTS = {
  PORT: 3000,
  CORS_ORIGIN: 'http://localhost:5173',
} as const;

export const BOOTSTRAP_CONTEXT = 'Bootstrap';

export const AI_CONFIG = {
  MODEL: 'claude-sonnet-4-6',
  MAX_TOKENS: 1024,
  RESPONSE_MIN_ITEMS: 3,
  RESPONSE_MAX_ITEMS: 5,
} as const;

export const UNDERWRITING = {
  CAP_RATE_LOW_THRESHOLD: 0.04,
  CAP_RATE_HIGH_THRESHOLD: 0.12,
  DSCR_MIN_THRESHOLD: 1.25,
  MONETARY_DECIMAL_PLACES: 2,
  RATIO_DECIMAL_PLACES: 4,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;
