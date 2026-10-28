/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename;
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(this, name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name, parent, ...rest);
};
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText, filename);
require.extensions['.tsx'] = require.extensions['.ts'];

const React = require('react');
const rental = require('../src/integrations/fleetedge/local-rental-adapter.ts');
const rates = require('../src/modules/rate-details/application/rate-service.ts');
const equipment = require('../src/modules/rate-details/domain/equipment.ts');
const { createDefaultSearchForm } = require('../src/modules/rental-search/domain/search-form.ts');
const { COUNTRIES_LIST } = require('../src/modules/rental-search/domain/countries.ts');
const { getTranslation } = require('../src/i18n/translation.ts');
let slots, cursor, effects, pushed, assigned, submitted, expired, triggered, actor;
const hooks = {
  ...React,
  useState: initial => {
    const index = cursor++;
    if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial;
    return [slots[index], value => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }];
  },
  useRef: initial => {
    const index = cursor++;
    return slots[index] ??= { current: initial };
  },
  useEffect: callback => { effects.push(callback); },
  useCallback: callback => callback,
};
// Execute the real submit handler. Isolate hooks, navigation and display only;
// successful submissions still create reservations through the actual adapter.
const load = Module._load;
Module._load = function (name, parent, ...rest) {
  if (name === 'lucide-react') return new Proxy({}, { get: () => 'i' });
  if (parent?.filename.endsWith('/SearchExpiryDialog.tsx')) {
    if (name === '@/shared/ui/dialog') return { Dialog: 'dialog', DialogContent: 'section', DialogTitle: 'h2', DialogDescription: 'p' };
    if (name === 'lucide-react') return { AlertCircle: 'i', Loader2: 'i' };
    if (name === './SearchSkeleton') return { VehicleCardSkeleton: 'div' };
  }
  if (parent?.filename.endsWith('/DriverForm.tsx') && name === '@/i18n/useI18n') {
    return { useI18n: () => ({ t: key => getTranslation(key, 'zh') }) };
  }
  if (parent?.filename.endsWith('/DriverBookingView.tsx')) {
    if (name === '@/i18n/LocaleNavigation') return { useUnsavedLocaleChanges: () => {} };
    if (name === 'react') return hooks;
    if (name === 'next/navigation') return { useRouter: () => ({ push: href => pushed.push(href) }) };
    if (name === '@/i18n/useI18n') return { useI18n: lang => ({ t: key => getTranslation(key, lang) }) };
    if (name === '@/modules/customer-account/public-api') return {
      useAuth: () => ({ isAuthenticated: true, isLoading: false }),
    };
    if (name === '@/modules/rate-details/public-api') return {
      ...rates, ...equipment, RateSummarySidebar: () => null,
    };
    if (name === '@/modules/reservation/public-api') return { DriverForm: () => null };
    if (name === '@/modules/rental-search/ui/SearchExpiryDialog') return {
      useSearchExpiry: () => ({ isExpired: expired, triggerExpiry: () => { triggered = true; } }),
    };
    if (name === '@/modules/booking-management/application/booking-store') return {
      createBooking: async input => { submitted.push(input); return rental.createReservation(input, actor); },
      listGuestBookings: async () => ({ orders: rental.listBookings(actor) }),
    };
  }
  return load.call(this, name, parent, ...rest);
};
const { DriverBookingView } = require('../src/app/[lang]/book/driver/DriverBookingView.tsx');
const { DriverForm } = require('../src/modules/reservation/ui/DriverForm.tsx');
const { SearchExpiryDialog } = require('../src/modules/rental-search/ui/SearchExpiryDialog.tsx');
const walk = (tree, predicate) => {
  if (!tree || typeof tree !== 'object') return undefined;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) {
    const found = walk(child, predicate);
    if (found) return found;
  }
};
function setup(country, lang = 'zh') {
  slots = []; pushed = []; assigned = []; submitted = []; expired = false; triggered = false;
  actor = { sessionId: crypto.randomUUID() };
  global.window = { location: { origin: 'http://rental.test', assign: href => assigned.push(href) } };
  global.sessionStorage = { getItem: () => null, setItem: () => {} };
  const search = { ...createDefaultSearchForm(country), pickup: { label: 'LAX', poiId: 'poi-lax-airport' } };
  const details = rental.createRateDetails(search, 'toyota-rav4-suv@US-LAX-01', lang);
  const props = { ...details, insuranceId: 'inclusive', initialEquipment: equipment.getDefaultEquipmentSelection(), lang };
  const render = () => { cursor = 0; effects = []; const tree = DriverBookingView(props); effects.forEach(effect => effect()); return tree; };
  render();
  const fill = (patch = {}) => {
    const field = walk(render(), node => node.props?.driver);
    field.props.onChange({ ...field.props.driver, firstName: 'Test', lastName: 'Traveler',
      email: 'test@example.com', phone: '5550001234', ...patch });
  };
  const submit = () => walk(render(), node => node.type === 'form').props.onSubmit({
    preventDefault() {}, currentTarget: { elements: { namedItem: () => null } },
  });
  return { details, render, fill, submit };
}

(async () => {
  for (const value of ['CN', 'US', 'China (Mainland)', 'United States']) {
    const tree = DriverForm({ driver: { licenseCountry: value }, onChange() {} });
    const select = walk(tree, node => node.props?.name === 'licenseCountry');
    const options = select.props.children;
    assert.equal(options.filter(option => option.props.value === select.props.value).length, 1);
    assert.equal(select.props.value, value === 'CN' || value === 'China (Mainland)' ? 'CN' : 'US');
  }
  console.log('✓ The displayed licence country matches its canonical form value, including legacy names');
  for (const lang of ['en', 'zh', 'ja', 'es', 'ko']) {
    const tree = SearchExpiryDialog({ isOpen: true, isRefreshing: false, onRefresh() {},
      variant: 'rate', lang, backHref: `/${lang}/rent` });
    const actions = [];
    const collect = node => {
      if (!node || typeof node !== 'object') return;
      if (node.type === 'button' || node.props?.href) actions.push(node);
      [node.props?.children].flat(Infinity).forEach(collect);
    };
    collect(tree);
    assert.equal(actions.length, 1);
    assert.equal(actions[0].type, 'button');
  }
  console.log('✓ The rate expiry prompt offers exactly one refresh action in all languages');
  for (const lang of ['en', 'zh', 'ja', 'es', 'ko']) {
    for (const country of COUNTRIES_LIST) {
      const flow = setup(country.code, lang);
      assert.equal(walk(flow.render(), node => node.props?.driver).props.driver.licenseCountry, country.code);
      flow.fill();
      await flow.submit();
      assert.equal(assigned.length, 0, `${lang}/${country.code} unexpectedly refreshed`);
      assert.equal(submitted.length, 1);
      assert.equal(pushed.length, 1);
      assert.ok(pushed[0].startsWith(`/${lang}/checkout/`));
      assert.equal(submitted[0].rateDetailsId, flow.details.trip.rateDetailsId);
      assert.equal(rental.listBookings(actor)[0].driver.licenseCountry, country.code);
    }
  }
  console.log('✓ Unchanged country goes directly to checkout for every supported country and language');
  const changed = setup('CN');
  changed.fill({ licenseCountry: 'JP' });
  await changed.submit();
  const destination = new URL(assigned[0]);
  assert.equal(destination.searchParams.get('licenseCountry'), 'JP');
  assert.equal(destination.searchParams.has('rateDetailsId'), false);
  assert.equal(submitted.length, 0);
  console.log('✓ A real country change refreshes the selected rate without creating a reservation');
  const overdue = setup('CN');
  overdue.fill();
  const now = Date.now;
  try {
    Date.now = () => Date.parse(overdue.details.trip.rateExpiresAt);
    await overdue.submit();
    assert.equal(triggered, true);
    assert.equal(pushed.length, 0);
    assert.equal(rental.listBookings(actor).length, 0);
  } finally { Date.now = now; }
  console.log('✓ Server expiry blocks checkout and opens the refresh prompt even before the UI timer fires');
  const equivalent = setup('China (Mainland)');
  assert.equal(equivalent.details.trip.licenseCountry, 'CN');
  equivalent.fill({ licenseCountry: 'China (Mainland)' });
  await equivalent.submit();
  assert.equal(assigned.length, 0);
  assert.equal(pushed.length, 1);
  console.log('✓ Equivalent country names and codes never count as a country change');
})().catch(error => { console.error(error); process.exitCode = 1; });
