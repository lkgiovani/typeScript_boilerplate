import { injectable } from 'tsyringe';
import type { HealthRepository } from '@/modules/health/domain/repositories/HealthRepository';
import { trace } from '@/shared/infra/decorators/trace';
import { AppDataSource } from '@/shared/infra/persistence/data-source';

@injectable()
export class TypeOrmReadyRepository implements HealthRepository {
  @trace()
  async ping(): Promise<boolean> {
    await AppDataSource.query('SELECT 1');
    return true;
  }
}
