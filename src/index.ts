import 'reflect-metadata';
import { setupInstrumentation } from './instrumentation';

setupInstrumentation();

import '@/container';

import type { LoggerProvider } from '@shared/domain/providers/LoggerProvider/LoggerProvider';
import { container } from 'tsyringe';
import { env } from '@/config/env';
import { app } from '@/server';
import { SHARED_DEPENDENCIES } from './shared/token';

async function bootstrap() {
  const logger = container.resolve<LoggerProvider>(SHARED_DEPENDENCIES.Logger);

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });

    logger.info(`Server is running on port ${env.PORT}`);
  } catch (err) {
    logger.error('Failed to start the server', { error: err instanceof Error ? err : String(err) });
    process.exit(1);
  }
}

bootstrap();
