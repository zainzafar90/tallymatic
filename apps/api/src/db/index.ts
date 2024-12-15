import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { config } from '@/config/config';

import * as schema from './schema';

const pool = new Pool({
  connectionString: config.db.url,
});

export const db: NodePgDatabase<typeof schema> = drizzle(pool, { schema });
