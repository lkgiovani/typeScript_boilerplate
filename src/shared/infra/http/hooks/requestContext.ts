import { requestContextStorage } from '@shared/infra/context/requestContext';
import fp from 'fastify-plugin';
import { ulid } from 'ulid';

const requestContext = fp(async app => {
  app.addHook('onRequest', function requestContextHandler(request, reply, done) {
    const requestId = (request.headers['x-request-id'] as string | undefined) ?? ulid();
    requestContextStorage.enterWith({ requestId });

    reply.header('x-request-id', requestId);
    done();
  });
});

export { requestContext };
