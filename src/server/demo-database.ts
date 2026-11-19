import { neon } from '@neondatabase/serverless';

export const demoEnvironment = () => process.env.VERCEL_ENV === 'preview' ? 'preview' : 'production';

/** Schema and environment rows are provisioned once, never during a customer request. */
export async function readDemoDatabase(signal: AbortSignal) {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query('SELECT revision, payload FROM trustgo_demo_state WHERE environment = $1',
    [demoEnvironment()], { fetchOptions: { signal, cache: 'no-store' } });
  if (rows.length !== 1) throw new Error('DEMO_STORAGE_NOT_INITIALIZED');
  return { revision: String(rows[0].revision), bytes: Buffer.from(rows[0].payload, 'base64') };
}

/** PostgreSQL makes the revision check and replacement one atomic operation. */
export async function commitDemoDatabase(revision: string, bytes: Buffer, signal: AbortSignal) {
  const sql = neon(process.env.DATABASE_URL!);
  const rows = await sql.query(`UPDATE trustgo_demo_state SET payload = $1, revision = revision + 1, updated_at = now()
    WHERE environment = $2 AND revision = $3 RETURNING revision`,
  [bytes.toString('base64'), demoEnvironment(), revision], { fetchOptions: { signal, cache: 'no-store' } });
  if (rows.length !== 1) throw new Error('DEMO_STORAGE_CONFLICT');
}
