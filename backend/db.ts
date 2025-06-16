import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const dbUrl =
  process.env.DATABASE_URL ||
  'postgres://postgres:root@localhost:5432/calendar';

export const pool = new Pool({
  connectionString: dbUrl,
});
