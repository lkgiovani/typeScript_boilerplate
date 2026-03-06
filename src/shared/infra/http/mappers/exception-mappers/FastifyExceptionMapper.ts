import { BadRequestException } from '@shared/domain/exceptions/BadRequestException.ts';
import type { BaseException } from '@shared/domain/exceptions/BaseException.ts';
import { NotFoundException } from '@shared/domain/exceptions/NotFoundException.ts';
import { ValidationException } from '@shared/domain/exceptions/ValidationException';
import type { ErrorExceptionMapper } from '@shared/domain/mappers/ErrorExceptionMapper.ts';
import type { FastifyError } from 'fastify';

const FASTIFY_EXCEPTION_MAP: Record<string, (error: FastifyError) => BaseException> = {
  FST_ERR_VALIDATION: error => {
    const details: Record<string, string> = {};
    if (Array.isArray(error.validation)) {
      for (const e of error.validation) {
        const missingProperty = e.params && typeof e.params === 'object' && 'missingProperty' in e.params
          ? String(e.params.missingProperty)
          : undefined;
        const key = e.instancePath || missingProperty || 'unknown';
        details[key] = e.message ?? 'Invalid value';
      }
    }
    return new ValidationException('Validation failed', undefined, details);
  },
  FST_ERR_NOT_FOUND: () => new NotFoundException(),
  FST_ERR_BAD_URL: () => new BadRequestException('Malformed request URL'),
};

class FastifyExceptionMapper implements ErrorExceptionMapper {
  canHandle(code: string | number): boolean {
    return typeof code === 'string' && code in FASTIFY_EXCEPTION_MAP;
  }

  toException(code: string | number, error: unknown): BaseException {
    const factory = FASTIFY_EXCEPTION_MAP[code as string] ?? (() => new NotFoundException());
    return factory(error as FastifyError);
  }
}

export { FastifyExceptionMapper };
