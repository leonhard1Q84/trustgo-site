/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
const load = Module._load;
let input = {};
const cookieJar = new Map();
class Conflict extends Error {}
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
const fileState = () => {
  try { return fs.readFileSync(process.env.TG_TEST_STATE); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
};
const etag = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
Module._load = function (name, parent, ...rest) {
  if (name === 'next/headers') return { cookies: async () => ({ get: key => cookieJar.has(key) ? { value: cookieJar.get(key) } : undefined }) };
  if (name === '@vercel/blob') return {
    BlobPreconditionFailedError: Conflict,
    async get(_pathname, options) {
      assert.equal(options.access, 'private'); assert.equal(options.useCache, false);
      if (input.storageFailure) throw new Error('storage unavailable');
      const bytes = fileState();
      return bytes ? { statusCode: 200, stream: new Response(bytes).body, blob: { etag: etag(bytes) } } : null;
    },
    async put(_pathname, bytes, options) {
      assert.equal(options.access, 'private'); assert.equal(options.addRandomSuffix, false);
      const lock = `${process.env.TG_TEST_STATE}.lock`;
      try { fs.mkdirSync(lock); } catch { throw new Conflict(); }
      try {
        const previous = fileState();
        if (options.ifMatch ? !previous || etag(previous) !== options.ifMatch : previous) throw new Conflict();
        const temporary = `${process.env.TG_TEST_STATE}.${process.pid}.tmp`;
        fs.writeFileSync(temporary, bytes);
        fs.renameSync(temporary, process.env.TG_TEST_STATE);
      } finally { fs.rmdirSync(lock); }
    },
  };
  // Render real server pages; only visual leaf components are stubbed.
  if (parent?.filename.includes('/src/app/[lang]/')) {
    if (name === '@/i18n/useI18n') return { getTranslation: key => key };
    if (name === '@/modules/rate-details/public-api') return require('../src/modules/rate-details/application/rate-service.ts');
    if (name === '@/modules/reservation/public-api') return { BookingProgressStepper: () => null };
    if (['./RateDetailsView', './DriverBookingView'].includes(name)) return { [name.slice(2)]: () => null };
  }
  const result = load.call(this, name, parent, ...rest);
  if (name.endsWith('/demo-state') || (name === './demo-state' && parent?.filename.includes('/src/server/'))) {
    return { ...result, withDemoState: async operation => {
      try { return await result.withDemoState(operation); }
      catch (error) { if (!error.code && !error.digest) console.error(error); throw error; }
    } };
  }
  return result;
};
require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText, filename,
);
function findTrip(tree) {
  if (!tree || typeof tree !== 'object') return;
  if (tree?.props?.trip) return tree.props.trip;
  for (const child of [tree?.props?.children].flat(Infinity)) { const trip = findTrip(child); if (trip) return trip; }
}
async function child() {
  input = JSON.parse(fs.readFileSync(0, 'utf8'));
  for (const [key, value] of input.cookies ?? []) cookieJar.set(key, value);
  process.env.NODE_ENV = 'production'; process.env.TRUSTGO_DEMO_MODE = 'true';
  process.env.BLOB_READ_WRITE_TOKEN = 'isolated-test'; process.env.VERCEL = '1';
  if (input.advance) { const now = Date.now() + input.advance; Date.now = () => now; }
  if (input.action === 'quote') {
    const form = require('../src/modules/rental-search/domain/search-form.ts');
    const search = { ...form.createDefaultSearchForm('US', new Date(Date.now() + 4 * 86400000)),
      pickup: { label: 'Naha', storeCode: 'OKA01' } };
    const Page = require('../src/app/[lang]/rent/[id]/page.tsx').default;
    return findTrip(await Page({ params: Promise.resolve({ lang: 'zh', id: 'toyota-rav4-suv' }),
      searchParams: Promise.resolve({ ...Object.fromEntries(new URLSearchParams(form.buildSearchQuery(search))), offer: 'toyota-rav4-suv@OKA01' }) }));
  }
  if (input.action === 'driver') {
    const Page = require('../src/app/[lang]/book/driver/page.tsx').default;
    return findTrip(await Page({ params: Promise.resolve({ lang: 'zh' }), searchParams: Promise.resolve({ rateDetailsId: input.rate }) }));
  }
  if (input.action === 'checkout') {
    const { readPageBooking } = require('../src/modules/booking-management/application/read-page-booking.ts');
    try { return await readPageBooking(input.code, 'zh', `/zh/checkout/${input.code}`); }
    catch (error) { return { redirect: error.digest }; }
  }
  const account = input.action.startsWith('account/');
  const action = account ? input.action.slice(8) : input.action;
  const handler = require(account ? `../src/app/api/account/${action}/route.ts` : '../src/app/api/rental/[...action]/route.ts');
  const request = new Request(`https://demo.invalid/api/${account ? 'account' : 'rental'}/${action}`, {
    method: input.body ? 'POST' : 'GET', headers: { origin: 'https://demo.invalid', 'content-type': 'application/json' },
    ...(input.body ? { body: JSON.stringify(input.body) } : {}),
  });
  const response = await handler[input.body ? 'POST' : 'GET'](request, { params: Promise.resolve({ action: action.split('/') }) });
  for (const cookie of response.cookies.getAll()) {
    if (cookie.value) cookieJar.set(cookie.name, cookie.value); else cookieJar.delete(cookie.name);
  }
  return { status: response.status, data: await response.json(), cookies: [...cookieJar], cache: response.headers.get('Cache-Control') };
}
if (process.argv.includes('--child')) {
  child().then(result => process.stdout.write(JSON.stringify(result))).catch(error => { console.error(error); process.exitCode = 1; });
} else {
  (async () => {
    const folder = fs.mkdtempSync(path.join(os.tmpdir(), 'trustgo-demo-test-'));
    const call = payload => new Promise((resolve, reject) => {
      const proc = require('node:child_process').spawn(process.execPath, [__filename, '--child'], {
        env: { ...process.env, TG_TEST_STATE: path.join(folder, 'state.bin') }, stdio: ['pipe', 'pipe', 'pipe'],
      });
      let output = '', errors = '';
      proc.stdout.on('data', chunk => output += chunk); proc.stderr.on('data', chunk => errors += chunk);
      proc.on('error', reject); proc.on('close', code => {
        if (code) reject(new Error(errors));
        else if (errors && !payload.storageFailure) reject(new Error(errors));
        else resolve(JSON.parse(output));
      });
      proc.stdin.end(JSON.stringify(payload));
    });
    let passed = 0;
    const test = async (name, fn) => { await fn(); passed++; console.log(`✓ ${name}`); };
    try {
      let quote, cookies, booking;
      const equipment = { infantSeat: 0, childSeat: 0, boosterSeat: 0, gpsNavigation: false, snowChains: false };
      let reservation;
      await test('quote SSR and driver SSR share the original quote across fresh processes', async () => {
        quote = await call({ action: 'quote' });
        assert.equal(Date.parse(quote.rateExpiresAt) - Date.parse(quote.rateCheckedAt), 30 * 60_000);
        const driver = await call({ action: 'driver', rate: quote.rateDetailsId });
        assert.equal(driver.rateDetailsId, quote.rateDetailsId); assert.equal(driver.rateExpiresAt, quote.rateExpiresAt);
      });
      await test('new API processes create one authorized reservation from a page quote, including concurrent retries', async () => {
        cookies = (await call({ action: 'bookings' })).cookies;
        reservation = { rateDetailsId: quote.rateDetailsId, insuranceId: 'basic', equipment,
          driver: { title: 'Mr', firstName: 'Acceptance', lastName: 'Traveler', email: 'acceptance@example.invalid', phoneCountryCode: '+1', phone: '5550001234', licenseCountry: 'US' },
          idempotencyKey: crypto.randomUUID() };
        const results = await Promise.all([1, 2].map(() => call({ action: 'reservations', cookies, body: reservation })));
        for (const result of results) assert.equal(result.status, 200, JSON.stringify(result.data));
        assert.equal(results[0].data.confirmationCode, results[1].data.confirmationCode);
        booking = results[0].data;
        const list = await call({ action: 'bookings', cookies }); assert.equal(list.data.orders.length, 1);
      });
      await test('checkout SSR in a fresh process resolves both access cookie and order; other guests cannot read it', async () => {
        assert.equal((await call({ action: 'checkout', code: booking.confirmationCode, cookies })).confirmationCode, booking.confirmationCode);
        assert.equal((await call({ action: `bookings/${booking.confirmationCode}` })).status, 404);
      });
      await test('failed payment state persists despite the error response, then concurrent successful retries charge once', async () => {
        const action = `bookings/${booking.confirmationCode}/payment`;
        assert.equal((await call({ action, cookies, body: { idempotencyKey: crypto.randomUUID(), localPaymentScenario: 'declined' } })).status, 409);
        assert.equal((await call({ action: `bookings/${booking.confirmationCode}`, cookies })).data.paymentStatus, 'failed');
        const body = { idempotencyKey: crypto.randomUUID() };
        const results = await Promise.all([1, 2].map(() => call({ action, cookies, body })));
        for (const result of results) { assert.equal(result.status, 200); assert.equal(result.data.status, 'CONFIRMED'); }
        assert.equal(results[0].data.paymentTransactionId, results[1].data.paymentTransactionId);
      });
      await test('verified surname grants survive new processes and can be revoked before checkout SSR', async () => {
        const lookup = await call({ action: 'guest-lookup', body: { confirmationCode: booking.confirmationCode, lastName: 'Traveler' } });
        assert.equal(lookup.status, 200);
        assert.equal((await call({ action: 'checkout', code: booking.confirmationCode, cookies: lookup.cookies })).confirmationCode, booking.confirmationCode);
        await call({ action: 'revoke', cookies: lookup.cookies, body: {} });
        assert.ok((await call({ action: 'checkout', code: booking.confirmationCode, cookies: lookup.cookies })).redirect);
      });
      await test('registration, sessions, password continuation and logout survive new account processes', async () => {
        const rules = require('../src/modules/customer-account/domain/account.rules.ts');
        const registered = await call({ action: 'account/registrations', body: { email: 'account@example.invalid', password: 'AcceptancePassword123', password_confirmation: 'AcceptancePassword123', terms_version: rules.CURRENT_TERMS_VERSION, privacy_version: rules.CURRENT_PRIVACY_VERSION, consent_locale: 'en', account_creation_request_id: crypto.randomUUID() } });
        assert.equal(registered.status, 200);
        assert.equal((await call({ action: 'account/session', cookies: registered.cookies })).data.authenticated, true);
        assert.equal((await call({ action: 'account/sign-in', body: { email: 'account@example.invalid' } })).data.code, 'PASSWORD_REQUIRED');
        await call({ action: 'account/sign-out', cookies: registered.cookies, body: {} });
        assert.equal((await call({ action: 'account/session', cookies: registered.cookies })).data.authenticated, false);
      });
      await test('storage outage remains a service error and cannot fall back to empty memory', async () => {
        const result = await call({ action: 'bookings', cookies, storageFailure: true });
        assert.equal(result.status, 503); assert.equal(result.data.code, 'service_unavailable');
      });
      await test('expired quote is rejected server-side without extending its expiry', async () => {
        const result = await call({ action: 'reservations', cookies, advance: 31 * 60_000,
          body: { ...reservation, idempotencyKey: crypto.randomUUID() } });
        assert.equal(result.status, 410); assert.equal(result.data.code, 'rate_expired');
      });
      await test('device clock ahead, behind or changed does not alter service quote lifetime', () => {
        const { expiryLifetime } = require('../src/modules/rental-search/domain/expiry-clock.ts');
        for (const now of [Date.parse(quote.rateCheckedAt) - 86400000, Date.parse(quote.rateCheckedAt) + 86400000]) {
          assert.equal(expiryLifetime(quote.rateExpiresAt, quote.rateCheckedAt, now), 30 * 60_000);
        }
        assert.equal(expiryLifetime(quote.rateCheckedAt, quote.rateExpiresAt), 0);
        assert.equal(expiryLifetime('invalid', quote.rateCheckedAt), 0);
      });
      await test('expired customer data and email indices are removed from the retained demo snapshot', () => {
        const { pruneDemoSnapshot } = require('../src/server/demo-retention.ts');
        const now = Date.now(); const old = new Date(now - 8 * 86400000).toISOString();
        const namespaces = { accounts: { accounts: new Map([['id', { created_at: old }]]), emailIndex: new Map([['private@example.invalid', 'id']]) },
          rental: { bookings: new Map([['id', { expires: now - 1 }]]) } };
        pruneDemoSnapshot(namespaces, now);
        assert.equal(namespaces.accounts.accounts.size, 0); assert.equal(namespaces.accounts.emailIndex.size, 0);
        assert.equal(namespaces.rental.bookings.size, 0);
      });
      console.log(`\n${passed} demo deployment regressions passed (separate processes, no network/browser).`);
    } finally { fs.rmSync(folder, { recursive: true, force: true }); }
  })().catch(error => { console.error(error); process.exitCode = 1; });
}
