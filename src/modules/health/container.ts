import { container } from 'tsyringe';
import type { HealthRepository } from './domain/repositories/HealthRepository';
import { TypeOrmReadyRepository } from './infra/persistence/typeOrm/TypeORMReadyRepository';
import { HEALTH_DEPENDENCIES } from './token';

container.registerSingleton<HealthRepository>(HEALTH_DEPENDENCIES.HealthRepository, TypeOrmReadyRepository);
