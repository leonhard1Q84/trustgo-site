/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Exercise the actual handlers and adapters in an isolated process. Cookies
// stand in for Next's request context; no browser, network, or live data is used.
process.env.NODE_ENV = 'test';
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
const load = Module._load;
let cookieJar = new Map();
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
Module._load = function (name, ...rest) {
  if (name === 'next/headers') return { cookies: async () => ({ get: key => cookieJar.has(key) ? { value: cookieJar.get(key) } : undefined }) };
  return load.call(this, name, ...rest);
};
require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText, filename,
);
const { CustomerAccountStore: store } = require('../src/server/customerAccountStore.ts');
const { resetAccountRequestLimitsForTesting } = require('../src/server/account-route.ts');
const notifications = require('../src/server/customerAccountNotifications.ts');
const rules = require('../src/modules/customer-account/domain/account.rules.ts');
const { initialAuthView, safeAccountReturnPath } = require('../src/modules/customer-account/domain/auth-flow.ts');
const { createAccountRequestId } = require('../src/modules/customer-account/application/account-request.ts');
const { CustomerAccountService } = require('../src/modules/customer-account/application/customerAccountService.ts');
const rental = require('../src/integrations/fleetedge/local-rental-adapter.ts');
const { createDefaultSearchForm } = require('../src/modules/rental-search/domain/search-form.ts');
const { getDefaultEquipmentSelection } = require('../src/modules/rate-details/domain/equipment.ts');
const { completeCheckoutAccount } = require('../src/server/checkout-account.ts');
const routes = {};
for (const name of ['registrations', 'sign-in', 'password/challenges', 'password/set', 'session', 'sign-out',
  'profile', 'checkout-creation', 'security/password', 'security/email-verification/challenges', 'security/email-verification/verify']) {
  routes[name] = require(`../src/app/api/account/${name}/route.ts`);
}
const rentalRoutes = require('../src/app/api/rental/[...action]/route.ts');
const consent = { terms_version: rules.CURRENT_TERMS_VERSION, privacy_version: rules.CURRENT_PRIVACY_VERSION, locale: 'en' };
const email = 'review@example.invalid';
const password = 'ReviewPassword123';
const driver = { title: 'Ms', firstName: 'Review', lastName: 'Traveler', email,
  phoneCountryCode: '+1', phone: '5550001234', licenseCountry: 'US' };
const registration = (patch = {}) => ({ email, password, password_confirmation: password,
  terms_version: consent.terms_version, privacy_version: consent.privacy_version,
  consent_locale: 'en', account_creation_request_id: createAccountRequestId(), ...patch });

async function call(name, method = 'POST', body = {}, options = {}) {
  const url = `http://localhost/api/account/${name}`;
  const request = new Request(url, { method, headers: { origin: 'http://localhost', 'content-type': 'application/json', ...options.headers },
    ...(method === 'GET' ? {} : { body: options.raw ?? JSON.stringify(body) }) });
  const response = await routes[name][method](request);
  if (options.applyCookies !== false) for (const cookie of response.cookies.getAll()) {
    if (cookie.value) cookieJar.set(cookie.name, cookie.value); else cookieJar.delete(cookie.name);
  }
  return { status: response.status, body: await response.json(), cookies: response.cookies.getAll(), headers: response.headers };
}
function createAccount(patch = {}) {
  return store.createOrReuseAccount({ email, password, consent: { ...consent, agreed_at: new Date().toISOString() }, source: 'standalone_registration', ...patch }).account;
}
function loginAccount(account) {
  const session = store.createSession(account.account_id, account.primary_email);
  cookieJar.set(rules.SESSION_COOKIE_NAME, session.session_id);
  return session;
}
function resetPayload(challenge, patch = {}) {
  return { email, challenge_id: challenge.challenge.challenge_id, verification_code: challenge.rawCode,
    new_password: 'NewReviewPassword123', new_password_confirmation: 'NewReviewPassword123', purpose: 'forgot_password', ...patch };
}
function withTime(delta, callback) {
  const now = Date.now;
  const value = now() + delta;
  Date.now = () => value;
  try { return callback(); } finally { Date.now = now; }
}
function bookingFixture(accountCreation, actor = { sessionId: crypto.randomUUID() }) {
  const search = { ...createDefaultSearchForm('US', new Date(Date.now() + 2 * 86400000)),
    pickup: { label: 'LAX', poiId: 'poi-lax-airport' } };
  const rate = rental.createRateDetails(search, 'toyota-rav4-suv@US-LAX-01', 'en');
  const booking = rental.createReservation({ rateDetailsId: rate.trip.rateDetailsId, insuranceId: 'basic',
    equipment: getDefaultEquipmentSelection(), driver, idempotencyKey: crypto.randomUUID(), accountCreation }, actor);
  return { actor, booking };
}
let passed = 0;
async function test(name, callback) {
  store._resetForTesting();
  resetAccountRequestLimitsForTesting();
  notifications.resetCustomerAccountNotificationEvents();
  cookieJar = new Map();
  await callback();
  passed++;
  console.log(`✓ ${name}`);
}

(async () => {
  await test('direct registration starts with email; challenge requires a fresh server challenge', () => {
    assert.equal(initialAuthView('register', ''), 'initial');
    assert.equal(initialAuthView('register', email), 'register');
    assert.equal(initialAuthView('challenge', email), 'initial');
    assert.notEqual(createAccountRequestId(), createAccountRequestId());
  });
  await test('return paths reject external redirects and authentication loops', () => {
    for (const input of ['//evil.invalid', '/\\evil.invalid', 'javascript:alert(1)', '/en/account/sign-in']) {
      assert.equal(safeAccountReturnPath(input, 'en'), '/en/account');
    }
    assert.equal(safeAccountReturnPath('/zh/manage-booking?tab=upcoming', 'zh'), '/zh/manage-booking?tab=upcoming');
  });
  await test('standalone registration creates unverified account and HttpOnly session without a code', async () => {
    const result = await call('registrations', 'POST', registration());
    assert.equal(result.status, 200);
    assert.equal(result.body.account.password_state, 'set');
    assert.equal(result.body.account.email_verification_state, 'unverified');
    assert.ok(result.cookies.find(c => c.name === rules.SESSION_COOKIE_NAME).httpOnly);
    assert.equal((await call('session', 'GET')).body.authenticated, true);
    const orders = await rentalRoutes.GET(new Request('http://localhost/api/rental/bookings'), {
      params: Promise.resolve({ action: ['bookings'] }),
    });
    assert.equal(orders.status, 200);
    assert.deepEqual(await orders.json(), { status: 'active', orders: [] });
    assert.equal(notifications.listCustomerAccountNotificationEvents().length, 1);
    assert.equal(store.findByEmail(email).management_preferences.marketing_opt_in, false);
  });
  await test('existing email never overwrites password; valid retry is idempotent', async () => {
    const input = registration();
    const first = await call('registrations', 'POST', input);
    const retry = await call('registrations', 'POST', input);
    assert.equal(retry.body.account.customer_id, first.body.account.customer_id);
    assert.equal(notifications.listCustomerAccountNotificationEvents().length, 1);
    const duplicate = await call('registrations', 'POST', registration({ password: 'AnotherPassword123', password_confirmation: 'AnotherPassword123' }));
    assert.equal(duplicate.body.code, 'EMAIL_ALREADY_EXISTS');
    assert.equal(store.verifyPassword(email, password).valid, true);
  });
  await test('knowing an old registration key cannot authenticate with a different password', async () => {
    const input = registration({ account_creation_request_id: `acct_req_${email.length}` });
    await call('registrations', 'POST', input);
    cookieJar.clear();
    const replay = await call('registrations', 'POST', { ...input, password: 'WrongPassword123', password_confirmation: 'WrongPassword123' });
    assert.equal(replay.status, 409);
    assert.equal(replay.body.code, 'IDEMPOTENCY_CONFLICT');
    assert.equal(replay.cookies.length, 0);
  });
  await test('legal version and consent language must match supported published values', async () => {
    for (const patch of [{ terms_version: 'outdated' }, { privacy_version: '' }, { consent_locale: 'unknown' }]) {
      assert.equal((await call('registrations', 'POST', registration(patch))).status, 400);
      assert.equal(store.findByEmail(email), undefined);
    }
  });
  await test('email continuation distinguishes new, password and first-time setup without returning profiles', async () => {
    assert.equal((await call('sign-in', 'POST', { email })).body.code, 'ACCOUNT_NOT_FOUND');
    createAccount();
    assert.equal((await call('sign-in', 'POST', { email })).body.code, 'PASSWORD_REQUIRED');
    store._resetForTesting();
    const account = createAccount({ password: undefined, source: 'guest_checkout' });
    store.updateProfile(account.account_id, { first_name: 'Private', phone_number: '5550001234' });
    const result = await call('sign-in', 'POST', { email });
    assert.equal(result.body.code, 'PASSWORD_NOT_SET');
    assert.equal(result.body.account, undefined);
    assert.equal(result.cookies.length, 0);
  });
  await test('only a correct password signs in', async () => {
    createAccount();
    assert.equal((await call('sign-in', 'POST', { email, password: 'WrongPassword123' })).status, 401);
    assert.equal((await call('sign-in', 'POST', { email, password })).body.success, true);
  });
  await test('first-time setup requires the correct code, verifies email and signs in', async () => {
    createAccount({ password: undefined, source: 'guest_checkout' });
    const ch = await call('password/challenges', 'POST', { email, purpose: 'first_time_password', locale: 'en' });
    const result = await call('password/set', 'POST', { ...resetPayload({ challenge: { challenge_id: ch.body.challenge_id }, rawCode: ch.body.dev_code }), purpose: 'first_time_password' });
    assert.equal(result.body.success, true);
    assert.equal(result.body.account.email_verification_state, 'verified');
    assert.equal(result.body.account.password_state, 'set');
    assert.equal((await call('session', 'GET')).body.authenticated, true);
  });
  await test('password format and confirmation errors preserve the valid one-time code', async () => {
    createAccount();
    const ch = store.createChallenge(email, 'forgot_password');
    assert.equal((await call('password/set', 'POST', resetPayload(ch, { new_password: 'short', new_password_confirmation: 'short' }))).body.code, 'INVALID_PASSWORD');
    assert.equal((await call('password/set', 'POST', resetPayload(ch, { new_password_confirmation: 'Mismatch123' }))).body.code, 'PASSWORD_MISMATCH');
    assert.equal((await call('password/set', 'POST', resetPayload(ch))).body.success, true);
    assert.equal((await call('password/set', 'POST', resetPayload(ch))).body.success, false);
  });
  await test('reset revokes all old sessions and every older challenge', async () => {
    const account = createAccount();
    const first = store.createSession(account.account_id, email);
    const second = store.createSession(account.account_id, email);
    const ch = store.createChallenge(email, 'forgot_password');
    assert.equal((await call('password/set', 'POST', resetPayload(ch))).body.success, true);
    assert.equal(store.getSession(first.session_id), undefined);
    assert.equal(store.getSession(second.session_id), undefined);
    assert.equal(store.verifyPassword(email, password).valid, false);
    assert.equal(store.verifyPassword(email, 'NewReviewPassword123').valid, true);
  });
  await test('codes cannot cross purposes or reset a password through omitted purpose', async () => {
    createAccount();
    const ch = store.createChallenge(email, 'email_verification');
    assert.equal((await call('password/set', 'POST', resetPayload(ch))).body.success, false);
    assert.equal((await call('password/set', 'POST', resetPayload(ch, { purpose: undefined }))).status, 400);
    assert.equal(store.verifyChallengeCode(ch.challenge.challenge_id, email, ch.rawCode, 'email_verification').valid, true);
    assert.equal((await call('password/challenges', 'POST', { email, purpose: 'registration' })).status, 400);
  });
  await test('first-time setup cannot replace an existing password', async () => {
    createAccount();
    const ch = store.createChallenge(email, 'first_time_password');
    assert.equal((await call('password/set', 'POST', resetPayload(ch, { purpose: 'first_time_password' }))).body.success, false);
    assert.equal(store.verifyPassword(email, password).valid, true);
  });
  await test('unknown email receives a generic challenge response and never creates an account', async () => {
    const result = await call('password/challenges', 'POST', { email, purpose: 'forgot_password' });
    assert.equal(result.body.success, true);
    assert.equal(result.body.dev_code, undefined);
    assert.equal(store.findByEmail(email), undefined);
    assert.equal(notifications.listCustomerAccountNotificationEvents().length, 0);
  });
  await test('case changes cannot bypass resend cooldown; a new code invalidates all older codes', () => {
    const first = store.createChallenge(email, 'forgot_password');
    assert.equal(store.createChallenge('Review@EXAMPLE.INVALID', 'first_time_password').rateLimited, true);
    const second = withTime(61_000, () => store.createChallenge('Review@example.invalid', 'forgot_password'));
    assert.equal(second.success, true);
    assert.equal(store.verifyChallengeCode(first.challenge.challenge_id, email, first.rawCode, 'forgot_password').valid, false);
    assert.equal(store.verifyChallengeCode(second.challenge.challenge_id, email, second.rawCode, 'forgot_password').valid, true);
  });
  await test('codes expire after ten minutes and enforce a bounded attempt count', () => {
    const ch = store.createChallenge(email, 'forgot_password');
    const wrong = ch.rawCode === '111111' ? '222222' : '111111';
    for (let i = 0; i < 5; i++) assert.equal(store.verifyChallengeCode(ch.challenge.challenge_id, email, wrong, 'forgot_password').valid, false);
    assert.equal(store.verifyChallengeCode(ch.challenge.challenge_id, email, ch.rawCode, 'forgot_password').reason, 'TOO_MANY_ATTEMPTS');
    const next = withTime(61_000, () => store.createChallenge(email, 'forgot_password'));
    assert.equal(withTime(12 * 60_000, () => store.verifyChallengeCode(next.challenge.challenge_id, email, next.rawCode, 'forgot_password')).reason, 'EXPIRED');
  });
  await test('password attempts are rate limited across email case and request sources', async () => {
    createAccount();
    for (let i = 0; i < 10; i++) assert.equal((await call('sign-in', 'POST', { email, password: 'wrong' })).status, 401);
    assert.equal((await call('sign-in', 'POST', { email: 'Review@example.invalid', password: 'wrong' }, { headers: { 'x-forwarded-for': 'another-source' } })).status, 429);
  });
  await test('account mutations enforce origin, JSON object input and payload bounds', async () => {
    assert.equal((await call('registrations', 'POST', registration(), { headers: { origin: 'https://elsewhere.invalid' } })).status, 403);
    assert.equal((await call('registrations', 'POST', registration(), { headers: { 'content-type': 'text/plain' } })).status, 415);
    for (const raw of ['{', 'null', '[]']) assert.equal((await call('registrations', 'POST', {}, { raw })).status, 400);
    assert.equal((await call('registrations', 'POST', {}, { raw: 'x'.repeat(20_001) })).status, 413);
    assert.equal((await call('registrations', 'POST', registration({ email: {} }))).status, 400);
  });
  await test('password change rotates the current cookie and revokes other devices', async () => {
    const account = createAccount();
    const old = loginAccount(account);
    assert.equal((await call('security/password', 'PATCH', { current_password: 'wrong', new_password: 'ChangedPassword123', new_password_confirmation: 'ChangedPassword123' })).status, 403);
    assert.ok(store.getSession(old.session_id));
    const result = await call('security/password', 'PATCH', { current_password: password, new_password: 'ChangedPassword123', new_password_confirmation: 'ChangedPassword123' });
    assert.equal(result.body.success, true);
    assert.equal(store.getSession(old.session_id), undefined);
    assert.notEqual(cookieJar.get(rules.SESSION_COOKIE_NAME), old.session_id);
    assert.equal((await call('session', 'GET')).body.authenticated, true);
  });
  await test('session expiry clears the server cookie; sign-out revokes the current session', async () => {
    const account = createAccount();
    const old = loginAccount(account);
    assert.equal((await call('sign-out')).body.success, true);
    assert.equal(store.getSession(old.session_id), undefined);
    assert.equal(cookieJar.has(rules.SESSION_COOKIE_NAME), false);
    const expired = loginAccount(account);
    expired.expires_at = Date.now() - 1;
    assert.equal((await call('session', 'GET')).body.authenticated, false);
    assert.equal(cookieJar.has(rules.SESSION_COOKIE_NAME), false);
    assert.equal((await call('profile', 'GET')).status, 401);
  });
  await test('authenticated email verification updates only verification state for an existing password', async () => {
    const account = createAccount();
    const session = loginAccount(account);
    const challenge = await call('security/email-verification/challenges');
    const body = { challenge_id: challenge.body.challenge_id, verification_code: challenge.body.dev_code };
    assert.equal((await call('security/email-verification/verify', 'POST', {
      ...body, new_password: 'UnexpectedPassword123', new_password_confirmation: 'UnexpectedPassword123',
    })).status, 400);
    const result = await call('security/email-verification/verify', 'POST', body);
    assert.equal(result.body.account.email_verification_state, 'verified');
    assert.equal(store.verifyPassword(email, password).valid, true);
    assert.ok(store.getSession(session.session_id));
  });
  await test('authenticated first-time setup rotates the session after verifying email', async () => {
    const account = createAccount({ password: undefined, source: 'guest_checkout' });
    const session = loginAccount(account);
    const ch = await call('security/email-verification/challenges');
    const result = await call('security/email-verification/verify', 'POST', {
      challenge_id: ch.body.challenge_id, verification_code: ch.body.dev_code,
      new_password: password, new_password_confirmation: password,
    });
    assert.equal(result.body.success, true);
    assert.equal(result.body.account.password_state, 'set');
    assert.equal(store.getSession(session.session_id), undefined);
    assert.equal((await call('session', 'GET')).body.authenticated, true);
  });
  await test('protected 401 responses invalidate client state, while an incorrect sign-in password does not', async () => {
    const { accountFetch, ACCOUNT_UNAUTHORIZED_EVENT } = require('../src/modules/customer-account/application/account-request.ts');
    const oldFetch = global.fetch;
    const oldWindow = global.window;
    const events = new EventTarget();
    let unauthorized = 0;
    events.addEventListener(ACCOUNT_UNAUTHORIZED_EVENT, () => unauthorized++);
    global.window = events;
    global.fetch = async () => Response.json({ authenticated: false }, { status: 401 });
    try {
      await accountFetch('/api/account/profile');
      assert.equal(unauthorized, 1);
      await accountFetch('/api/account/sign-in/password', { method: 'POST' });
      assert.equal(unauthorized, 1);
    } finally {
      global.fetch = oldFetch;
      if (oldWindow === undefined) delete global.window; else global.window = oldWindow;
    }
  });
  await test('client never reports sign-out success on HTTP failure or a failed server result', async () => {
    const previous = global.fetch;
    try {
      for (const [status, body] of [[500, {}], [200, { success: false }], [500, { success: true }]]) {
        global.fetch = async () => Response.json(body, { status });
        assert.equal((await CustomerAccountService.signOut()).success, false);
      }
    } finally { global.fetch = previous; }
  });
  await test('anonymous checkout creation cannot use arbitrary email to retrieve account profiles', async () => {
    const account = createAccount();
    store.updateProfile(account.account_id, { first_name: 'Private', phone_number: '5550001234' });
    const result = await call('checkout-creation', 'POST', { email, create_account_requested: true, account_creation_consent: consent });
    assert.equal(result.status, 400);
    assert.equal(result.body.account, undefined);
    assert.equal((await call('checkout-creation', 'POST', { reservation_id: 'TG-NOT-REAL' })).status, 401);
  });
  await test('checkout opt-out and missing intent never create an account', () => {
    for (const selection of [undefined, { create_account_requested: false }]) {
      const { actor, booking } = bookingFixture(selection);
      rental.payBooking(booking.confirmationCode, crypto.randomUUID(), actor);
      assert.equal(completeCheckoutAccount(booking.confirmationCode, actor).success, true);
      assert.equal(store.findByEmail(email), undefined);
    }
  });
  await test('checkout requires valid recorded consent and confirmed payment', () => {
    assert.throws(() => bookingFixture({ create_account_requested: true }), error => error.code === 'invalid_request');
    const { actor, booking } = bookingFixture({ create_account_requested: true, account_creation_consent: consent });
    completeCheckoutAccount(booking.confirmationCode, actor);
    assert.equal(store.findByEmail(email), undefined);
    rental.payBooking(booking.confirmationCode, crypto.randomUUID(), actor);
    assert.equal(completeCheckoutAccount(booking.confirmationCode, actor).created, true);
    const account = store.findByEmail(email);
    assert.equal(account.password_state, 'not_set');
    assert.equal(account.email_verification_state, 'unverified');
    assert.equal(account.consent.locale, 'en');
    assert.equal(account.source, 'guest_checkout');
    assert.equal(cookieJar.has(rules.SESSION_COOKIE_NAME), false);
    completeCheckoutAccount(booking.confirmationCode, actor);
    assert.equal(notifications.listCustomerAccountNotificationEvents().length, 1);
    assert.equal(rental.readBooking(booking.confirmationCode, actor).accountCreationStatus, 'created');
  });
  await test('existing accounts are reused without password changes or profile disclosure', () => {
    const account = createAccount();
    const { actor, booking } = bookingFixture({ create_account_requested: true, account_creation_consent: consent });
    rental.payBooking(booking.confirmationCode, crypto.randomUUID(), actor);
    const result = completeCheckoutAccount(booking.confirmationCode, actor);
    assert.equal(result.created, true);
    assert.equal(result.account, undefined);
    assert.equal(store.findByEmail(email).account_id, account.account_id);
    assert.equal(store.verifyPassword(email, password).valid, true);
    assert.equal(notifications.listCustomerAccountNotificationEvents().length, 0);
  });
  await test('signed-in checkout never creates another account', () => {
    const account = createAccount({ email: 'signed-in@example.invalid' });
    const { actor, booking } = bookingFixture({ create_account_requested: true, account_creation_consent: consent },
      { sessionId: crypto.randomUUID(), accountId: account.account_id });
    rental.payBooking(booking.confirmationCode, crypto.randomUUID(), actor);
    completeCheckoutAccount(booking.confirmationCode, actor);
    assert.equal(store.findByEmail(email), undefined);
  });
  await test('payment handler completes checkout creation; account failure cannot roll back paid booking', async () => {
    const list = await rentalRoutes.GET(new Request('http://localhost/api/rental/bookings'), { params: Promise.resolve({ action: ['bookings'] }) });
    for (const cookie of list.cookies.getAll()) cookieJar.set(cookie.name, cookie.value);
    const actor = { sessionId: cookieJar.get('tg_rental_access') };
    const { booking } = bookingFixture({ create_account_requested: true, account_creation_consent: consent }, actor);
    const pay = () => rentalRoutes.POST(new Request(`http://localhost/api/rental/bookings/${booking.confirmationCode}/payment`, {
      method: 'POST', headers: { origin: 'http://localhost', 'content-type': 'application/json' },
      body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }),
    }), { params: Promise.resolve({ action: ['bookings', booking.confirmationCode, 'payment'] }) });
    const original = store.createOrReuseCheckoutAccount;
    try {
      store.createOrReuseCheckoutAccount = () => { throw new Error('simulated service failure'); };
      const response = await pay();
      assert.equal(response.status, 200);
      const paid = await response.json();
      assert.equal(paid.paymentStatus, 'paid');
      assert.equal(paid.status, 'CONFIRMED');
      assert.equal(paid.accountCreationStatus, 'failed');
    } finally { store.createOrReuseCheckoutAccount = original; }
    const recovered = await pay();
    assert.equal((await recovered.json()).accountCreationStatus, 'created');
    assert.ok(store.findByEmail(email));
  });
  await test('unconfigured production cannot create in-memory accounts or claim email delivery', async () => {
    process.env.NODE_ENV = 'production';
    try {
      assert.equal((await call('registrations', 'POST', registration())).status, 503);
      assert.equal((await call('password/challenges', 'POST', { email, purpose: 'forgot_password' })).status, 503);
      assert.equal((await call('session', 'GET')).status, 503);
      assert.equal(store.findByEmail(email), undefined);
      assert.throws(() => notifications.enqueueCustomerAccountNotification({ account: { primary_email: email }, notification_type: 'account_created', locale: 'en', idempotency_key: 'production-check' }));
    } finally { process.env.NODE_ENV = 'test'; }
  });
  console.log(`\n${passed} customer-account regression checks passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
