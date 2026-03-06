import { z } from 'zod';

const ErrorResponse = (status: number, error: string) =>
  z.object({
    status: z.literal(status),
    error: z.literal(error),
    message: z.string(),
  });

const ValidationErrorResponse = (status: number, error: string) =>
  z.object({
    status: z.literal(status),
    error: z.literal(error),
    message: z.string(),
    details: z.optional(z.record(z.string(), z.string())),
  });

const BadRequestResponse = ErrorResponse(400, 'Bad Request');
const UnauthorizedResponse = ErrorResponse(401, 'Unauthorized');
const ForbiddenResponse = ErrorResponse(403, 'Forbidden');
const NotFoundResponse = ErrorResponse(404, 'Not Found');
const InternalErrorResponse = ErrorResponse(500, 'Internal Server Error');
const ServiceUnavailableResponse = ErrorResponse(503, 'Service Unavailable');

export {
  BadRequestResponse,
  ForbiddenResponse,
  InternalErrorResponse,
  NotFoundResponse,
  ServiceUnavailableResponse,
  UnauthorizedResponse,
  ValidationErrorResponse,
};
