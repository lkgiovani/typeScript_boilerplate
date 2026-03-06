import z from 'zod';

export const readySchema = z.object({
  status: z.enum(['healthy', 'degraded', 'unhealthy']),
  timestamp: z.string(),
  uptime: z.number(),
  checks: z.object({
    database: z.boolean(),
    redis: z.boolean(),
  }),
});

export type ReadyUseCaseOutput = z.infer<typeof readySchema>;
