import { z } from 'zod';

const envSchema = z.object({
  SERVICE_NAME: z.string().default('my-service'),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  VERSION: z.string().default('0.1.0'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
  JWT_SECRET: z.string().min(1),
  ADMIN_PASSWORD: z.string().min(1),
  ADMIN_EMAIL: z.email(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().default('http://localhost:4317'),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  process.stderr.write(`Invalid environment variables: ${JSON.stringify(_env.error.issues, null, 2)}\n`);
  throw new Error('Invalid environment variables.');
}

export const env = _env.data;
