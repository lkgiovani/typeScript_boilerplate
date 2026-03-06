import '@fastify/jwt';
import type { User } from '../shared/infra/model/User';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: {
      sub: number;
      name: string;
      role: 'admin' | 'user';
    };
    user: User;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    jwt: {
      sub: number;
      name: string;
      role: 'admin' | 'user';
    };
    startTime?: number;
  }
}
