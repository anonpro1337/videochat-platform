import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../../.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),

  // Database
  DATABASE_URL: z.string(),
  REDIS_URL: z.string(),
  REDIS_PASSWORD: z.string().optional(),

  // JWT
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  // Supabase
  SUPABASE_URL: z.string(),
  SUPABASE_ANON_KEY: z.string(),
  SUPABASE_SERVICE_ROLE_KEY: z.string(),

  // Agora (WebRTC)
  AGORA_APP_ID: z.string(),
  AGORA_APP_CERTIFICATE: z.string(),

  // OpenAI
  OPENAI_API_KEY: z.string(),

  // Stripe
  STRIPE_SECRET_KEY: z.string(),
  STRIPE_WEBHOOK_SECRET: z.string(),

  // Razorpay
  RAZORPAY_KEY_ID: z.string(),
  RAZORPAY_KEY_SECRET: z.string(),

  // AWS
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string().default('us-east-1'),
  AWS_S3_BUCKET: z.string(),

  // PostHog
  POSTHOG_API_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().optional(),

  // FingerprintJS
  FINGERPRINTJS_API_KEY: z.string(),

  // reCAPTCHA
  RECAPTCHA_SECRET_KEY: z.string(),

  // Socket.IO
  SOCKET_CORS_ORIGIN: z.string().default('*'),

  // Client URLs
  WEB_APP_URL: z.string(),
  API_URL: z.string(),
  SOCKET_URL: z.string(),

  // Hive Moderation
  HIVE_API_KEY: z.string().optional(),

  // Cloudflare
  CLOUDFLARE_API_TOKEN: z.string().optional(),
  CLOUDFLARE_ACCOUNT_ID: z.string().optional(),

  // Sentry
  SENTRY_DSN: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
  }
  return parsed.data;
}

export const env = parseEnv();

export const config = {
  app: {
    name: 'VideoChat Platform',
    version: '1.0.0',
    port: env.PORT,
    host: env.HOST,
    env: env.NODE_ENV,
    isDev: env.NODE_ENV === 'development',
    isProd: env.NODE_ENV === 'production',
  },
  jwt: {
    secret: env.JWT_SECRET,
    refreshSecret: env.JWT_REFRESH_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY,
  },
  agora: {
    appId: env.AGORA_APP_ID,
    appCertificate: env.AGORA_APP_CERTIFICATE,
  },
  openai: {
    apiKey: env.OPENAI_API_KEY,
  },
  stripe: {
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  },
  razorpay: {
    keyId: env.RAZORPAY_KEY_ID,
    keySecret: env.RAZORPAY_KEY_SECRET,
  },
  aws: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
    region: env.AWS_REGION,
    s3Bucket: env.AWS_S3_BUCKET,
  },
  redis: {
    url: env.REDIS_URL,
    password: env.REDIS_PASSWORD,
  },
  database: {
    url: env.DATABASE_URL,
  },
  posthog: {
    apiKey: env.POSTHOG_API_KEY,
    host: env.POSTHOG_HOST,
  },
  fingerprint: {
    apiKey: env.FINGERPRINTJS_API_KEY,
  },
  recaptcha: {
    secretKey: env.RECAPTCHA_SECRET_KEY,
  },
  socket: {
    corsOrigin: env.SOCKET_CORS_ORIGIN,
  },
  urls: {
    web: env.WEB_APP_URL,
    api: env.API_URL,
    socket: env.SOCKET_URL,
  },
  moderation: {
    hiveApiKey: env.HIVE_API_KEY,
  },
  cloudflare: {
    apiToken: env.CLOUDFLARE_API_TOKEN,
    accountId: env.CLOUDFLARE_ACCOUNT_ID,
  },
  sentry: {
    dsn: env.SENTRY_DSN,
  },
} as const;
