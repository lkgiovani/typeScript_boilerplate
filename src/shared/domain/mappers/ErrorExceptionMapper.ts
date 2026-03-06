import type { BaseException } from '../exceptions/BaseException.ts';

interface ErrorExceptionMapper {
  canHandle(code: string | number, error?: unknown): boolean;
  toException(code: string | number, error?: unknown): BaseException;
}

export type { ErrorExceptionMapper };
