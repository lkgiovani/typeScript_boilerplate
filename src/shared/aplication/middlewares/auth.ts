import type { FastifyReply, FastifyRequest } from 'fastify';

import { UnauthorizedError } from '@/shared/errors/app-error';

export async function authorizer(request: FastifyRequest, _reply: FastifyReply) {
  try {
    const payload = await request.jwtVerify();
    request.jwt = payload as FastifyRequest['jwt'];
  } catch (_) {
    throw new UnauthorizedError('Token inválido ou ausente');
  }
}
