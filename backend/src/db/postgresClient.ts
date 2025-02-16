import { Pool } from 'pg';
import * as schema from './schema';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import dotenv from 'dotenv';
dotenv.config();

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USER, PG_PASSWORD } = process.env;

export default class PostgresClient {
  private static instance: NodePgDatabase<typeof schema>;
  private constructor() {}

  public static getInstance(): NodePgDatabase<typeof schema> {
    if (!PostgresClient.instance) {
      if (!PG_HOST || !PG_DATABASE || !PG_USER) {
        throw new Error('Missing database credentials.');
      }

      const pool = new Pool({
        host: PG_HOST,
        port: Number(PG_PORT || 5432),
        database: PG_DATABASE,
        user: PG_USER,
        password: PG_PASSWORD,
      });

      PostgresClient.instance = drizzle(pool, { schema });
    }

    return PostgresClient.instance;
  }
}
