import {
  SpanStatusCode,
  context,
  trace as otelTrace,
} from "@opentelemetry/api";

const tracer = otelTrace.getTracer("default");

function getClassName(target: object): string {
  if (typeof target === "function") return (target as { name: string }).name;
  return target.constructor.name;
}

function trace(spanName?: string): MethodDecorator {
  return (_target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;
    const methodName = String(propertyKey);

    descriptor.value = function (this: object, ...args: unknown[]) {
      const name = spanName ?? `${getClassName(this)}.${methodName}`;

      const parentContext = context.active();
      const span = tracer.startSpan(name, {}, parentContext);
      const spanContext = otelTrace.setSpan(parentContext, span);

      return context.with(spanContext, () => {
        try {
          const result = originalMethod.apply(this, args);

          if (
            result instanceof Promise ||
            (result && typeof result.then === "function")
          ) {
            return result
              .then((res: unknown) => {
                span.setStatus({ code: SpanStatusCode.OK });
                return res;
              })
              .catch((err: unknown) => {
                span.setStatus({
                  code: SpanStatusCode.ERROR,
                  message: String(err),
                });
                span.recordException(err as Error);
                throw err;
              })
              .finally(() => {
                span.end();
              });
          }

          span.setStatus({ code: SpanStatusCode.OK });
          span.end();
          return result;
        } catch (err) {
          span.setStatus({ code: SpanStatusCode.ERROR, message: String(err) });
          span.recordException(err as Error);
          span.end();
          throw err;
        }
      });
    };

    return descriptor;
  };
}

export { trace };
