import type { LoggerProvider } from '@shared/domain/providers/LoggerProvider/LoggerProvider.ts';
import type { FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { container } from 'tsyringe';
import { DEPENDENCIES } from '@/di/dependencies';
import { ValidationException } from '@/shared/domain/exceptions/ValidationException';
import { ExceptionHttpMapper } from '../mappers/ExceptionHttpMapper';
import { ExceptionMapperChain } from '../mappers/exception-mappers/ExceptionMapperChain';
import { FastifyExceptionMapper } from '../mappers/exception-mappers/FastifyExceptionMapper';

const exceptionMapper = new ExceptionMapperChain([new FastifyExceptionMapper()]);

const errorHandler = fp(async app => {
  app.setErrorHandler(function errorHandlerHook(error: FastifyError, _request, reply) {
    const exception = exceptionMapper.toException(error.code ?? 'UNKNOWN', error);

    if (exception.reportable) {
      const logger = container.resolve<LoggerProvider>(DEPENDENCIES.Logger);
      logger.error(exception.message, exception.metadata);
    }

    const httpMapping = ExceptionHttpMapper.toHttp(exception.code);

    const body = exception instanceof ValidationException
      ? { status: httpMapping.status, error: httpMapping.error, message: exception.message, details: exception.details }
      : { status: httpMapping.status, error: httpMapping.error, message: exception.message };

    reply.status(httpMapping.status).send(body);
  });
});

export { errorHandler };
