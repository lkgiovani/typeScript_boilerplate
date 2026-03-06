import type { DataSource, EntityTarget, FindOptionsWhere, Repository } from 'typeorm';

import type { GenericRepository } from '@/shared/aplication/contract/repository/GenericRepository';
import { trace } from '@/shared/infra/decorators/trace';

type Id = string | number;

export class TypeORMGenericRepository<T extends { id: Id }> implements GenericRepository<T> {
  protected repository: Repository<T>;

  constructor(entity: EntityTarget<T>, dataSource: DataSource) {
    this.repository = dataSource.getRepository(entity);
  }

  @trace()
  create(entity: T): T {
    return this.repository.create(entity);
  }

  @trace()
  async remove(entity: T | T[]): Promise<void> {
    await this.repository.remove(entity as T);
  }

  @trace()
  findOne(options: T): Promise<T | null> {
    return this.repository.findOne({ where: options as FindOptionsWhere<T> });
  }

  @trace()
  findById(id: Id): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  @trace()
  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  @trace()
  save(entity: T): Promise<T> {
    return this.repository.save(entity as T);
  }

  @trace()
  async delete(id: Id): Promise<void> {
    await this.repository.delete(id);
  }
}
