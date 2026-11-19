import { neon } from '@neondatabase/serverless';
import { serialize } from 'node:v8';

// Run explicitly against an env file; never logs credentials or business contents.
if (!process.argv[2]) throw new Error('Usage: node scripts/setup-demo-database.mjs /path/to/env');
process.loadEnvFile(process.argv[2]);
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL missing');
const sql = neon(process.env.DATABASE_URL);
await sql.query(`CREATE TABLE IF NOT EXISTS trustgo_demo_state (
  environment text PRIMARY KEY CHECK (environment IN ('production', 'preview')),
  revision bigint NOT NULL DEFAULT 0,
  payload text NOT NULL CHECK (octet_length(payload) <= 11184812),
  updated_at timestamptz NOT NULL DEFAULT now()
)`);
for (const environment of ['production', 'preview']) {
  await sql.query(`INSERT INTO trustgo_demo_state (environment, payload) VALUES ($1, $2)
    ON CONFLICT (environment) DO NOTHING`, [environment, serialize({ version: 1, namespaces: {} }).toString('base64')]);
}
console.log('Demo schema ready; existing rows preserved; preview/production isolated.');
