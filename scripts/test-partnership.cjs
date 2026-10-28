/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const { randomUUID } = require('node:crypto');

// Actual route and adapter, with transport stubbed: no enquiry is sent externally.
process.env.NODE_ENV = 'test';
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) => module._compile(
  ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: {
    module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true,
  } }).outputText, filename,
);
const { POST } = require('../src/app/api/franchise-applications/route.ts');
const fixture = { contactName: ' Test Contact ', company: ' Test Rentals ', email: 'Contact@Example.invalid', help: '', consent: true, lang: 'zh' };
let calls = [];
global.fetch = async (url, options) => {
  calls.push({ url, options });
  return Response.json({ accepted: true });
};
function reset() {
  global.__tgPartnershipAttempts.clear();
  global.__tgPartnershipLimits.clear();
  calls = [];
}
async function request(body = fixture, options = {}) {
  const response = await POST(new Request('https://trustgo.test/api/franchise-applications', {
    method: 'POST',
    headers: { origin: 'https://trustgo.test', 'content-type': 'application/json', 'idempotency-key': options.id ?? randomUUID(), ...options.headers },
    body: options.raw ?? JSON.stringify(body),
  }));
  return { status: response.status, body: await response.json(), headers: response.headers };
}
let passed = 0;
async function test(name, run) {
  reset();
  process.env.NODE_ENV = 'test';
  process.env.PARTNERSHIP_API_URL = 'https://partnership.example.invalid/applications';
  delete process.env.PARTNERSHIP_PRODUCTION_READY;
  await run();
  passed++;
  console.log(`✓ ${name}`);
}
(async () => {
  await test('Rejects cross-origin, non-JSON and missing request IDs without delivery', async () => {
    assert.equal((await request(fixture, { headers: { origin: 'https://other.test' } })).status, 403);
    assert.equal((await request(fixture, { headers: { 'content-type': 'text/plain' } })).status, 415);
    assert.equal((await request(fixture, { headers: { 'idempotency-key': '' } })).status, 400);
    assert.equal(calls.length, 0);
  });
  await test('Validates consent, locales, required fields, email, size and malformed input', async () => {
    for (const patch of [{ consent: false }, { lang: 'xx' }, { contactName: ' ' }, { email: 'a@@b.c' }, { help: 'a'.repeat(2001) }, { company: ['invalid'] }, { contactName: '\u0000bad' }]) {
      assert.equal((await request({ ...fixture, ...patch })).status, 400);
    }
    assert.equal((await request(fixture, { raw: '{' })).status, 400);
    assert.equal((await request(fixture, { raw: ' '.repeat(17000) })).status, 400);
    assert.equal(calls.length, 0);
  });
  await test('Forwards only allowed fields, normalizes values and requires explicit acceptance', async () => {
    const result = await request({ ...fixture, secret: 'ignored' });
    assert.equal(result.status, 202);
    assert.deepEqual(result.body, { accepted: true });
    assert.equal(result.headers.get('cache-control'), 'private, no-store');
    const body = JSON.parse(calls[0].options.body);
    assert.equal(body.contactName, 'Test Contact');
    assert.equal(body.email, 'contact@example.invalid');
    assert.equal(body.source, 'trustgo');
    assert.equal(body.secret, undefined);
    assert.equal(calls[0].options.redirect, 'error');
    assert.ok(calls[0].options.signal);
  });
  await test('Collapses concurrent and repeated submissions; rejects reusing a key for different data', async () => {
    const id = randomUUID();
    const results = await Promise.all([request(fixture, { id }), request(fixture, { id })]);
    assert.ok(results.every(r => r.status === 202));
    assert.equal((await request(fixture, { id })).status, 202);
    assert.equal(calls.length, 1);
    assert.equal((await request({ ...fixture, company: 'Different Rentals' }, { id })).status, 409);
    assert.equal(calls.length, 1);
  });
  await test('Missing configuration and unverified production do not deliver or claim success', async () => {
    delete process.env.PARTNERSHIP_API_URL;
    assert.equal((await request()).status, 503);
    process.env.PARTNERSHIP_API_URL = 'https://partnership.example.invalid/applications';
    process.env.NODE_ENV = 'production';
    assert.equal((await request()).status, 503);
    process.env.NODE_ENV = 'test';
    process.env.PARTNERSHIP_API_URL = 'http://partnership.example.invalid/applications';
    assert.equal((await request()).status, 503);
    assert.equal(calls.length, 0);
  });
  await test('Upstream failure, ambiguous success and timeout stay retryable with the same key', async () => {
    const normalFetch = global.fetch;
    const id = randomUUID();
    global.fetch = async () => Response.json({}, { status: 200 });
    assert.equal((await request(fixture, { id })).status, 502);
    global.fetch = async () => Response.json({}, { status: 500 });
    assert.equal((await request(fixture, { id })).status, 502);
    global.fetch = async () => { throw new DOMException('timeout', 'TimeoutError'); };
    assert.equal((await request(fixture, { id })).status, 502);
    global.fetch = normalFetch;
    assert.equal((await request(fixture, { id })).status, 202);
    assert.equal(calls[0].options.headers['Idempotency-Key'], id);
  });
  await test('Limits repeated requests before they reach the enquiry service', async () => {
    for (let i = 0; i < 10; i++) assert.equal((await request()).status, 202);
    const result = await request();
    assert.equal(result.status, 429);
    assert.equal(result.headers.get('retry-after'), '60');
    assert.equal(calls.length, 10);
  });
  console.log(`\n${passed} partnership API checks passed (no external network).`);
})().catch(error => { console.error(error); process.exitCode = 1; });
