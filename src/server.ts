import 'reflect-metadata';
import '@/container';

import fastify from 'fastify';
import { serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod';

import { errorHandler } from '@shared/infra/http/hooks/errorHandler';
import { httpMetrics } from '@shared/infra/http/hooks/httpMetrics';
import { requestContext } from '@shared/infra/http/hooks/requestContext';
import { docsPlugins } from './plugins/docs';
import { securityPlugins } from './plugins/security';
import { appRoutes } from './routes';

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: unknown;
  }
}

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(errorHandler);
app.register(requestContext);
app.register(httpMetrics);
app.register(securityPlugins);
app.register(docsPlugins);
app.register(appRoutes);
