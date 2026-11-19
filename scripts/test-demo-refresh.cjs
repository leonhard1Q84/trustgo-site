/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename, load = Module._load;
let effects, requests, changed;
const booking = { paymentStatus: 'paid', refundStatus: 'not_required' };
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
Module._load = function (name, parent, ...rest) {
  // Execute the real hook effects with controlled browser events and time.
  if (name === 'react') return {
    useState: value => [typeof value === 'function' ? value() : value, () => {}],
    useRef: value => ({ current: value }), useCallback: fn => fn,
    useEffect: fn => effects.push(fn),
  };
  if (name === 'next/navigation') return { useRouter: () => ({ replace() {} }) };
  if (name.endsWith('/AuthContext') || name === '@/modules/customer-account/public-api') {
    return { useAuth: () => ({ user: null, isLoading: false }) };
  }
  if (name === './booking-events') return { subscribeBookingChanges: fn => { changed = fn; return () => {}; } };
  if (name === './booking-store') return {
    listPendingCheckouts: async () => { requests++; return []; },
    listAccessibleBookings: async () => { requests++; return { status: 'missing', orders: [] }; },
    getBookingByConfirmationCode: async () => { requests++; return booking; },
  };
  return load.call(this, name, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
}).outputText, filename);
const originalNow = Date.now;
let now = 0, sequence = 0;
Date.now = () => now;
const timers = new Map();
global.window = new EventTarget();
global.document = new EventTarget();
document.visibilityState = 'visible';
global.setTimeout = (fn, delay) => { const id = ++sequence; timers.set(id, { at: now + delay, fn }); return id; };
global.clearTimeout = id => timers.delete(id);
global.setInterval = () => { throw new Error('Unexpected recurring timer in idle hook'); };
global.clearInterval = () => {};
const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
const advance = async delta => {
  const end = now + delta;
  for (const [id, timer] of timers) if (timer.at <= end) {
    now = timer.at; timers.delete(id); timer.fn(); await flush();
  }
  now = end;
};
async function mount(hook, ...args) {
  effects = []; requests = 0; changed = null; timers.clear();
  hook(...args);
  const cleanups = effects.map(effect => effect());
  await flush();
  return () => cleanups.forEach(fn => fn?.());
}
(async () => {
  for (const [file, name, args, initial] of [
    ['use-pending-checkouts', 'usePendingCheckouts', [], 1],
    ['use-booking-list', 'useBookingList', [], 1],
    ['use-booking-sync', 'useBookingSync', [booking, 'test', 'en', 'booking'], 0],
  ]) {
    const hook = require(`../src/modules/booking-management/application/${file}.ts`)[name];
    const unmount = await mount(hook, ...args);
    assert.equal(requests, initial);
    await advance(30 * 60_000);
    assert.equal(requests, initial, `${name}: idle navigation must not request anything`);
    window.dispatchEvent(new Event('focus'));
    document.dispatchEvent(new Event('visibilitychange'));
    await flush();
    assert.equal(requests, initial + 1, `${name}: paired return events must coalesce`);
    for (let i = 0; i < 20; i++) window.dispatchEvent(new Event('focus'));
    await flush(); assert.equal(requests, initial + 1);
    changed(); await flush(); assert.equal(requests, initial + 2, 'Business change must refresh immediately');
    unmount();
    console.log(`✓ ${name}: no idle requests, throttled return, immediate business refresh`);
  }
  const { useBookingSync } = require('../src/modules/booking-management/application/use-booking-sync.ts');
  const unmount = await mount(useBookingSync, { ...booking, paymentStatus: 'processing' }, 'test', 'en', 'checkout');
  await advance(12_000); assert.equal(requests, 1);
  await advance(30 * 60_000); assert.equal(requests, 1, 'Processing must not create an unbounded poll');
  unmount();
  console.log('✓ payment processing reconciles once and stops');
  Date.now = originalNow;
})().catch(error => { console.error(error); process.exitCode = 1; });
