import type { LoggerProvider } from '@shared/domain/providers/LoggerProvider/LoggerProvider';
import { PinoLoggerProvider } from '@shared/infra/providers/LoggerProvider/PinoLoggerProvider';
import { container } from 'tsyringe';
import type { CacheProvider } from './domain/providers/CacheProvider/CacheProvider';
import { RedisCacheProvider } from './infra/providers/CacheProvider/RedisCacheProvider';
import { SHARED_DEPENDENCIES } from './token';

container.registerSingleton<CacheProvider>(SHARED_DEPENDENCIES.CacheProvider, RedisCacheProvider);
container.registerSingleton<LoggerProvider>(SHARED_DEPENDENCIES.Logger, PinoLoggerProvider);
