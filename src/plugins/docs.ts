import swagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import fp from 'fastify-plugin';

export const docsPlugins = fp(async (app) => {
  app.register(swagger, {
    openapi: {
      info: {
        title: 'Gym Flow API',
        description: 'API para gestão de treinos',
        version: '1.0.0',
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
  });

  app.register(fastifySwaggerUi, { routePrefix: '/docs' });
});
