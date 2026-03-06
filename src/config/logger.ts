import { env } from "./env.ts";

const loggerConfig = {
  level: env.LOG_LEVEL,
  serviceName: env.SERVICE_NAME,
  serviceVersion: env.VERSION,
  environment: env.NODE_ENV,
} as const;

export { loggerConfig };
