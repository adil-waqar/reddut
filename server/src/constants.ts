export const __prod__ = process.env.NODE_ENV === 'production';
export const COOKIE_NAME = 'qid';
export const FORGET_PASSWORD_PREFIX = 'FORGET-PASSWORD:';
export const PORT: number = parseInt(process.env.PORT) || 4000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const REDIS_URL = process.env.REDIS_URL;
export const SESSION_SECRET = process.env.SESSION_SECRET;
export const CORE_ORIGIN = process.env.CORS_ORIGIN;
