import type { FastifyInstance } from "fastify";
import { healthRoutes } from "./modules/health/infra/healthRoutes";

export function appRoutes(app: FastifyInstance) {
  app.register(healthRoutes);
}
