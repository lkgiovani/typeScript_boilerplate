import { trace as otelTrace } from '@opentelemetry/api';
import type { FastifyInstance } from 'fastify';
import { container } from 'tsyringe';

import type { Logger } from '@/shared/aplication/contract/service/Logger';
import { requestContextStorage } from '@/shared/infra/context/requestContext';
import { SHARED_DEPENDENCIES } from '@/shared/token';
import { HealthController } from './http/controller/HealthController';
import { healthSchema } from './http/schemas/HealthUseCaseDTO';
import { readySchema } from './http/schemas/ReadyUseCaseDTO';

export function healthRoutes(app: FastifyInstance) {
  const healthController = new HealthController();

  app.addHook('onRequest', (_request, _reply, done) => {
    const store = requestContextStorage.getStore();
    const span = otelTrace.getActiveSpan();
    const logger = container.resolve<Logger>(SHARED_DEPENDENCIES.Logger);

    logger.info('[health] request received', {
      requestId: store?.requestId,
      traceId: span?.spanContext().traceId,
    });

    done();
  });

  app.get(
    '/health',
    {
      schema: {
        summary: 'Health check',
        description: 'Health check',
        tags: ['Health'],
        response: {
          200: healthSchema,
        },
      },
    },
    healthController.checkHealth.bind(healthController),
  );

  app.get(
    '/ready',
    {
      schema: {
        summary: 'Ready check',
        description: 'Ready check',
        tags: ['Health'],
        response: {
          200: readySchema,
        },
      },
    },
    healthController.checkReady.bind(healthController),
  );
}
