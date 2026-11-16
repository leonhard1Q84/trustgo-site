import { AsyncLocalStorage } from 'node:async_hooks';
import { deserialize, serialize } from 'node:v8';
import { setTimeout as backoff } from 'node:timers/promises';
import { get, put, BlobPreconditionFailedError } from '@vercel/blob';
import { demoDeploymentEnabled } from './demo-mode';
import { pruneDemoSnapshot } from './demo-retention';

type Namespaces = Record<string, object>;
interface Snapshot { version: 1; namespaces: Namespaces }
const globals = globalThis as typeof globalThis & { __tgDemoContext?: AsyncLocalStorage<Namespaces> };
const context = globals.__tgDemoContext ??= new AsyncLocalStorage<Namespaces>();
const PATH = `trustgo-demo/${process.env.VERCEL_ENV === 'preview' ? 'preview' : 'production'}-state-v1.bin`;
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

/** Private, origin reads and compare-and-swap writes; never fall back on storage errors. */
export async function withDemoState<T>(operation: () => Promise<T>): Promise<T> {
  if (context.getStore() || !demoDeploymentEnabled()) return operation();
  if (!process.env.BLOB_READ_WRITE_TOKEN && !process.env.BLOB_STORE_ID) {
    if (process.env.VERCEL) throw new Error('DEMO_STORAGE_UNAVAILABLE');
    return operation();
  }
  for (let attempt = 0; attempt < 8; attempt++) {
    const response = await get(PATH, { access: 'private', useCache: false });
    if (response && response.statusCode !== 200) throw new Error('DEMO_STORAGE_INVALID');
    const bytes = response ? Buffer.from(await new Response(response.stream).arrayBuffer()) : undefined;
    if (bytes && bytes.length > MAX_BYTES) throw new Error('DEMO_STORAGE_LIMIT');
    const snapshot: Snapshot = bytes ? deserialize(bytes) : { version: 1, namespaces: {} };
    if (snapshot.version !== 1 || !snapshot.namespaces) throw new Error('DEMO_STORAGE_INVALID');
    pruneDemoSnapshot(snapshot.namespaces);
    let value: T | undefined;
    let failure: unknown;
    let failed = false;
    await context.run(snapshot.namespaces, async () => {
      try { value = await operation(); }
      catch (error) { failed = true; failure = error; }
    });
    const updated = serialize(snapshot);
    if (updated.length > MAX_BYTES) throw new Error('DEMO_STORAGE_LIMIT');
    if (!bytes?.equals(updated)) {
      try {
        await put(PATH, updated, {
          access: 'private', addRandomSuffix: false, contentType: 'application/octet-stream',
          ...(response ? { ifMatch: response.blob.etag } : { allowOverwrite: false }),
        });
      } catch (error) {
        // First-write races also retry from the winner's snapshot.
        if (error instanceof BlobPreconditionFailedError || (!response && attempt < 7)) {
          await backoff(Math.min(250, 20 * 2 ** attempt) + Math.random() * 25);
          continue;
        }
        throw error;
      }
    }
    // Failed payment attempts and rate limits are state changes too. Commit before rethrowing.
    if (failed) throw failure;
    return value as T;
  }
  throw new Error('DEMO_STORAGE_BUSY');
}
