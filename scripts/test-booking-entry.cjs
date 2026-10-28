/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');

// Exercise the actual entry handlers with delayed server responses and isolated
// hooks/display components. Browser interaction remains a human acceptance step.
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
require.extensions['.tsx'] = require.extensions['.ts'];

let slots, cursor, effects, pushed, calls, response, pathname;
const hooks = {
  ...React,
  useState(initial) {
    const i = cursor++;
    if (!(i in slots)) slots[i] = initial;
    return [slots[i], value => { slots[i] = value; }];
  },
  useRef(initial) { const i = cursor++; return slots[i] ??= { current: initial }; },
  useCallback: fn => fn,
  useMemo: fn => fn(),
  useEffect: fn => effects.push(fn),
};
const load = Module._load;
Module._load = function (name, parent, ...rest) {
  if (parent?.filename.endsWith('/GuestLookupProvider.tsx')) {
    if (name === 'react') return hooks;
    if (name === 'next/dynamic') return { default: () => 'lookup-form' };
    if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
    if (name === 'next/navigation') return { usePathname: () => pathname,
      useRouter: () => ({ push: href => pushed.push(href), replace: href => pushed.push(href) }) };
    if (name === '@/i18n/useI18n') return { useI18n: () => ({ routeLang: 'en', t: key => key }) };
    if (name === '../application/booking-store') return { listAccessibleBookings: () => { calls++; return response.promise; } };
    if (name === '../application/use-lookup-viewport') return { useLookupViewport: () => undefined };
    if (name === './GuestLookupUrlTrigger') return { GuestLookupUrlTrigger: () => null };
    if (name === '@/shared/ui/button') return { Button: 'button' };
    if (name === '@/shared/ui/skeleton') return { Skeleton: 'skeleton' };
    if (name === '@/shared/ui/dialog') return Object.fromEntries(
      ['Dialog', 'DialogContent', 'DialogTitle', 'DialogBody', 'DialogFooter'].map(key => [key, key])
    );
  }
  return load.call(this, name, parent, ...rest);
};
const { GuestLookupProvider } = require('../src/modules/booking-management/ui/GuestLookupProvider.tsx');
global.document = { activeElement: null };
global.HTMLElement = class {};
function reset() {
  slots = []; effects = []; pushed = []; calls = 0; pathname = '/en/help';
  response = {};
  response.promise = new Promise((resolve, reject) => Object.assign(response, { resolve, reject }));
}
function render() {
  cursor = 0; effects = [];
  const tree = GuestLookupProvider({ children: null });
  return { entry: tree.props.value, dialog: tree.props.children.find(child => child?.type === 'Dialog') };
}
let passed = 0;
async function test(name, run) { reset(); await run(); passed++; console.log(`✓ ${name}`); }
(async () => {
  for (const [name, orders] of [['authorized guest', [{ confirmationCode: 'TG-123' }]], ['signed-in account without bookings', []]]) {
    await test(`${name} goes directly to the list after a silent server check`, async () => {
      const request = render().entry.openBookingEntry();
      assert.equal(calls, 1);
      assert.equal(render().dialog.props.open, false);
      assert.deepEqual(pushed, []);
      await render().entry.openBookingEntry();
      assert.equal(calls, 1, 'repeated clicks must not start another check');
      response.resolve({ status: 'active', orders });
      await request;
      assert.equal(render().dialog.props.open, false);
      assert.deepEqual(pushed, ['/en/manage-booking/orders']);
    });
  }
  await test('missing or expired access opens the form only after the server response', async () => {
    const request = render().entry.openBookingEntry();
    assert.equal(render().dialog.props.open, false);
    response.resolve({ status: 'missing', orders: [] });
    await request;
    assert.equal(render().dialog.props.open, true);
    assert.deepEqual(pushed, []);
  });
  await test('a failed silent check presents retry and never assumes missing access', async () => {
    const request = render().entry.openBookingEntry();
    assert.equal(render().dialog.props.open, false);
    response.reject(new Error('unavailable'));
    await request;
    const dialog = render().dialog;
    assert.equal(dialog.props.open, true);
    assert.ok(JSON.stringify(dialog).includes('rental_service_unavailable'));
    assert.deepEqual(pushed, []);
  });
  await test('explicit additional-booking lookup stays open when an older entry response arrives', async () => {
    const request = render().entry.openBookingEntry();
    render().entry.openLookup();
    assert.equal(render().dialog.props.open, true);
    response.resolve({ status: 'active', orders: [] });
    await request;
    assert.equal(render().dialog.props.open, true);
    assert.deepEqual(pushed, []);
  });
  await test('navigating away during a silent check prevents delayed navigation', async () => {
    const request = render().entry.openBookingEntry();
    pathname = '/en/locations';
    render();
    effects.forEach(effect => effect());
    await Promise.resolve();
    response.resolve({ status: 'active', orders: [] });
    await request;
    assert.equal(render().dialog.props.open, false);
    assert.deepEqual(pushed, []);
  });
  await test('authorized detail recovery also skips the lookup dialog', async () => {
    const request = render().entry.openBookingEntry({ returnTo: '/en/booking/TG-123' });
    assert.equal(render().dialog.props.open, false);
    response.resolve({ status: 'active', orders: [{ confirmationCode: 'TG-123' }] });
    await request;
    assert.equal(render().dialog.props.open, false);
    assert.deepEqual(pushed, ['/en/booking/TG-123']);
  });
  console.log(`\n${passed} booking entry scenarios passed.`);
})().catch(error => { console.error(error); process.exitCode = 1; });
