import { parseContentLength } from '@shared/infra/functions/parse.ts';
import { elapsedSeconds } from '@shared/infra/functions/time.ts';
import {
  httpServerActiveRequests,
  httpServerRequestBodySize,
  httpServerRequestDuration,
} from '@shared/infra/metrics/opentelemetry/httpMetrics.ts';
import fp from 'fastify-plugin';

type DurationAttributes = {
  method: string;
  route: string;
  status: number;
};

type RouteAttributes = {
  method: string;
  route: string;
};

const httpMetrics = fp(async (app) => {
  app.addHook('onRequest', function httpMetricsOnRequest(request, _reply, done) {
    request.startTime = performance.now();

    const routeAttributes = getRouteAttributes({
      method: request.method,
      route: request.routeOptions?.url ?? request.url,
    });

    httpServerActiveRequests.add(1, routeAttributes);

    const contentLength = parseContentLength(request.headers['content-length']);
    if (contentLength) httpServerRequestBodySize.record(contentLength, routeAttributes);

    done();
  });

  app.addHook('onResponse', function httpMetricsOnResponse(request, reply, done) {
    const method = request.method;
    const route = request.routeOptions?.url ?? request.url;
    const elapsed = elapsedSeconds(request.startTime ?? 0);
    const status = reply.statusCode;

    httpServerRequestDuration.record(elapsed, getDurationAttributes({ method, route, status }));
    httpServerActiveRequests.add(-1, getRouteAttributes({ method, route }));

    done();
  });
});

function getDurationAttributes({ method, route, status }: DurationAttributes) {
  return {
    'http.request.method': method,
    'http.route': route,
    'http.response.status_code': status,
  };
}

function getRouteAttributes({ method, route }: RouteAttributes) {
  return {
    'http.request.method': method,
    'http.route': route,
  };
}

export { httpMetrics };
