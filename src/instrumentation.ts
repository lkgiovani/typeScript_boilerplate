import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { PeriodicExportingMetricReader, MeterProvider } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor, NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { metrics } from '@opentelemetry/api';
import { contextSpanProcessor } from '@shared/infra/processors/opentelemetry/contextSpanProcessor';
import { opentelemetryConfig } from './config/opentelemetry';

function setupInstrumentation() {
  const resource = resourceFromAttributes({
    'service.name': opentelemetryConfig.serviceName,
    'service.version': opentelemetryConfig.serviceVersion,
    'deployment.environment.name': opentelemetryConfig.deploymentEnvironment,
  });

  const tracerProvider = new NodeTracerProvider({
    resource,
    spanProcessors: [contextSpanProcessor, new BatchSpanProcessor(new OTLPTraceExporter())],
  });

  tracerProvider.register();

  const meterProvider = new MeterProvider({
    resource,
    readers: [
      new PeriodicExportingMetricReader({
        exporter: new OTLPMetricExporter(),
      }),
    ],
  });

  metrics.setGlobalMeterProvider(meterProvider);

  new PgInstrumentation({
    requestHook: span => {
      span.setAttribute('db.statement', '');
    },
  }).enable();
}

export { setupInstrumentation };
