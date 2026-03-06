import z from 'zod';

export const healthSchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
});

export type HealthUseCaseOutput = z.infer<typeof healthSchema>;
