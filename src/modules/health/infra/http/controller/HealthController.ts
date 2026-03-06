import { trace } from '@shared/infra/decorators/trace';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { container } from 'tsyringe';
import { CheckHealthUseCase } from '@/modules/health/application/usecases/CheckHealthUseCase';
import { CheckReadinessUseCase } from '@/modules/health/application/usecases/CheckReadinessUseCase';

export class HealthController {
  @trace()
  async checkHealth(_: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const healthUseCase = container.resolve(CheckHealthUseCase);
    const result = await healthUseCase.execute();
    return reply.send(result);
  }

  @trace()
  async checkReady(_: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const readyUseCase = container.resolve(CheckReadinessUseCase);
    const result = await readyUseCase.execute();
    return reply.send(result);
  }
}
