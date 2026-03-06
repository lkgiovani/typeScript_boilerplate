import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

import { env } from '@/config/env';

export const securityPlugins = fp(async (app) => {
  app.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['*'],
    exposedHeaders: ['*'],
  });

  app.register(jwt, {
    secret: env.JWT_SECRET,
    decoratorName: 'jwt',
  });

  app.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    keyGenerator: (req) => req.ip,
    skipOnError: true,
  });
});
