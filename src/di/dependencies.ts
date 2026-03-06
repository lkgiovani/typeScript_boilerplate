import { HEALTH_DEPENDENCIES } from '@/modules/health/token';
import { SHARED_DEPENDENCIES } from '@/shared/token';

const DEPENDENCIES = {
  ...SHARED_DEPENDENCIES,
  ...HEALTH_DEPENDENCIES,
} as const;

export { DEPENDENCIES };
