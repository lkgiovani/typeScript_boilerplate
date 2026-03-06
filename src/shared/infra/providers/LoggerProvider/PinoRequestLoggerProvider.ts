import { trace } from '@shared/infra/decorators/trace';
import type { LoggerProvider } from '@/shared/domain/providers/LoggerProvider/LoggerProvider';
import { trace as otelTrace } from '@opentelemetry/api';
import { requestContextStorage } from '../../context/requestContext';
import type { PinoLoggerProvider } from './PinoLoggerProvider';

class PinoRequestLoggerProvider {
  @trace()
  static create(rootLogger: PinoLoggerProvider): LoggerProvider {
    const store = requestContextStorage.getStore();
    const spanContext = otelTrace.getActiveSpan()?.spanContext();

    return rootLogger.child({
      requestId: store?.requestId,
      traceId: spanContext?.traceId,
    });
  }
}

export { PinoRequestLoggerProvider };
