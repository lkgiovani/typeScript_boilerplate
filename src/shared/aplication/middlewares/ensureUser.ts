import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';

import type { UserRepository } from '@/modules/auth/aplication/contracts/UserRepository';
import { USER_TOKENS } from '@/modules/user/infra/token';
import { UnauthorizedError } from '@/shared/errors/app-error';

export const ensureUser = async (request: FastifyRequest, _reply: FastifyReply) => {
  const jwt = request.jwt;
  if (!jwt) {
    throw new UnauthorizedError('User not found');
  }

  const repository = await container.resolve<UserRepository>(USER_TOKENS.UserRepository);

  const userExist = await repository.findById(jwt.sub);
  if (!userExist) {
    throw new UnauthorizedError('User not found');
  }

  request.user = userExist;
};
