import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { env } from '@/config/env';



export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  synchronize: false, // Managed by Flyway
  logging: false,
  migrations: [],
  subscribers: [],
});
