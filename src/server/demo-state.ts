import { AsyncLocalStorage } from 'node:async_hooks';
import { deserialize, serialize } from 'node:v8';
import { setTimeout as backoff } from 'node:timers/promises';
import { readDemoDatabase, commitDemoDatabase } from './demo-database';
import { demoDeploymentEnabled } from './demo-mode';
import { pruneDemoSnapshot } from './demo-retention';
import { demoStorageFailure } from './demo-storage-errors';

type Namespaces = Record<string, object>;
interface Snapshot { version: 1; namespaces: Namespaces }
const globals = globalThis as typeof globalThis & { __tgDemoContext?: AsyncLocalStorage<Namespaces> };
const context = globals.__tgDemoContext ??= new AsyncLocalStorage<Namespaces>();
const MAX_BYTES = 8 * 1024 * 1024;

/** A request owns a snapshot; concurrent requests never exchange mutable objects. */
export function demoState<T extends object>(key: string, fallback: T, empty: () => T): T {
  return new Proxy(fallback, {
    get(_target, property) {
      const namespaces = context.getStore();
      const target = namespaces ? (namespaces[key] ??= empty()) as T : fallback;
      const value = Reflect.get(target, property, target);
      return typeof value === 'function' ? value.bind(target) : value;
    },
    set(_target, property, value) {
      const namespaces = context.getStore();
      const target = namespaces ? (namespaces[key] ??= empty()) as T : fallback;
      return Reflect.set(target, property, value);
    },
  });
}

/** Read fresh state; only business changes participate in conditional writes. */
export async function withDemoState<T>(operation: () => Promise<T>, options: { readOnly?: boolean } = {}): Promise<T> {
  if (context.getStore() || !demoDeploymentEnabled()) return operation();
  if (!process.env.DATABASE_URL) {
    if (process.env.VERCEL) throw new Error('DEMO_STORAGE_UNAVAILABLE');
    return operation();
  }
  const deadline = performance.now() + 12_000;
  for (let attempt = 0; attempt < 6; attempt++) {
    let phase: 'read' | 'operation' | 'write' = 'read';
    try {
      const signal = () => AbortSignal.timeout(Math.max(1, Math.min(4000, Math.ceil(deadline - performance.now()))));
      const { revision, bytes } = await readDemoDatabase(signal());
      if (bytes.length > MAX_BYTES) throw new Error('DEMO_STORAGE_LIMIT');
      const snapshot: Snapshot = deserialize(bytes);
      if (snapshot.version !== 1 || !snapshot.namespaces) throw new Error('DEMO_STORAGE_INVALID');
      pruneDemoSnapshot(snapshot.namespaces);
      // Cleanup alone must not make each page load compete for the same write lock.
      // Records expire immediately; physical removal occurs on the next business mutation.
      const baseline = serialize(snapshot);
      let value: T | undefined;
      let failure: unknown;
      let failed = false;
      phase = 'operation';
      await context.run(snapshot.namespaces, async () => {
        try { value = await operation(); }
        catch (error) { failed = true; failure = error; }
      });
      if (!options.readOnly) {
        const updated = serialize(snapshot);
        if (updated.length > MAX_BYTES) throw new Error('DEMO_STORAGE_LIMIT');
        if (!baseline.equals(updated)) {
          phase = 'write';
          await commitDemoDatabase(revision, updated, signal());
        }
      }
      // Failed payment attempts and rate limits are state changes too. Commit before rethrowing.
      phase = 'operation';
      if (failed) throw failure;
      return value as T;
    } catch (error) {
      const kind = phase === 'operation' ? 'permanent' : demoStorageFailure(error);
      const delay = Math.min(500, 40 * 2 ** attempt) + Math.random() * 80;
      if (kind !== 'permanent' && attempt < 5 && performance.now() + delay < deadline) {
        await backoff(delay);
        continue;
      }
      // Never log request inputs, cookies, credentials or snapshot contents.
      if (phase !== 'operation' || (error instanceof Error && error.message.startsWith('DEMO_STORAGE_'))) {
        console.error('TrustGo demo storage unavailable', { phase, kind, attempts: attempt + 1 });
      }
      throw error;
    }
  }
  throw new Error('DEMO_STORAGE_BUSY');
}
