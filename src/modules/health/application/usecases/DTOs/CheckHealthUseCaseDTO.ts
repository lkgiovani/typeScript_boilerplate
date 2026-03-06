import type { HealthStatus } from '@/modules/health/domain/enums/HealthStatus.ts';

interface CheckHealthOutput {
  status: HealthStatus;
  timestamp: string;
  uptime: number;
}

export type { CheckHealthOutput };
