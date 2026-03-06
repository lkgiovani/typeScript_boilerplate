import { env } from './env';

const opentelemetryConfig = {
  serviceName: env.SERVICE_NAME,
  serviceVersion: env.VERSION,
  deploymentEnvironment: env.NODE_ENV,
};

export { opentelemetryConfig };
