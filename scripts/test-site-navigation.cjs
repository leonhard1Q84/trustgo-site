/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const root = path.resolve(__dirname, '..');
const resolve = Module._resolveFilename,
  load = Module._load;
Module._resolveFilename = function (name, parent, ...rest) {
  return resolve.call(
    this,
    name.startsWith('@/') ? path.join(root, 'src', name.slice(2)) : name,
    parent,
    ...rest
  );
};
require.extensions['.tsx'] = require.extensions['.ts'] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
        jsx: ts.JsxEmit.ReactJSX,
        esModuleInterop: true,
      },
    }).outputText,
    filename
  );
const { localizedNavigationHref } = require('../src/i18n/navigation.ts');
const { routeLanguages } = require('../src/i18n/locales.ts');
const { getTranslation } = require('../src/i18n/translation.ts');
const {
  safeRateRecoveryPath,
} = require('../src/modules/reservation/application/route-recovery.ts');
const rental = require('../src/integrations/fleetedge/local-rental-adapter.ts');
const { createDefaultSearchForm } = require('../src/modules/rental-search/domain/search-form.ts');
const { getStoreOffer } = require('../src/modules/rental-search/domain/store-offers.ts');
let passed = 0;
function test(name, fn) {
  fn();
  passed++;
  console.log(`✓ ${name}`);
}

test('language changes preserve the selected rental, quote, protection, equipment and safe recovery route', () => {
  const recovery = '/en/rent/toyota-rav4-suv?pickupStoreCode=KLDJ01&insurance=inclusive';
  const query = new URLSearchParams({
    pickupStoreCode: 'KLDJ01',
    pickupDate: '2030-01-10T10:00',
    returnDate: '2030-01-13T10:00',
    driverAge: '30',
    licenseCountry: 'US',
    rateDetailsId: 'original-quote',
    insurance: 'inclusive',
    equipment: '{"childSeat":1}',
    returnTo: recovery,
  });
  for (const lang of routeLanguages)
    for (const page of ['rent', 'rent/toyota-rav4-suv', 'book/driver']) {
      const url = new URL(
        localizedNavigationHref(`/en/${page}?${query}`, lang),
        'https://trustgo.invalid'
      );
      assert.equal(url.pathname, `/${lang}/${page}`);
      for (const [key, value] of query)
        if (key !== 'returnTo') assert.equal(url.searchParams.get(key), value);
      assert.ok(safeRateRecoveryPath(url.searchParams.get('returnTo'), lang));
    }
});
test('language links discard external recovery URLs and unrelated personal query fields', () => {
  for (const returnTo of ['https://evil.invalid', '//evil.invalid', '/\\evil.invalid']) {
    const url = new URL(
      localizedNavigationHref(
        `/en/book/driver?rateDetailsId=original&email=private&password=private&returnTo=${encodeURIComponent(returnTo)}`,
        'ja'
      ),
      'https://trustgo.invalid'
    );
    assert.deepEqual([...url.searchParams], [['rateDetailsId', 'original']]);
  }
  assert.equal(localizedNavigationHref('//evil.invalid', 'zh'), '/zh');
  assert.equal(
    localizedNavigationHref('/en/help/customer-service#after-rental', 'ko'),
    '/ko/help/customer-service#after-rental'
  );
});
test('localized quote display keeps the same amounts, identity and expiry without changing the stored quote', () => {
  const search = {
    ...createDefaultSearchForm('US', new Date(Date.now() + 2 * 86400000)),
    pickup: { label: 'LAX', poiId: 'poi-lax-airport' },
  };
  const original = rental.createRateDetails(search, 'toyota-rav4-suv@US-LAX-01', 'en');
  for (const lang of routeLanguages) {
    const shown = rental.getRateDetailsForDisplay(original.trip.rateDetailsId, lang);
    assert.equal(shown.trip.rateDetailsId, original.trip.rateDetailsId);
    assert.equal(shown.trip.rateExpiresAt, original.trip.rateExpiresAt);
    assert.equal(shown.vehicle.pricePerDay, original.vehicle.pricePerDay);
    assert.equal(shown.trip.pickupStoreCode, original.trip.pickupStoreCode);
    assert.equal(
      shown.trip.pickupLocation,
      getStoreOffer(shown.trip.offerId).storeNames[lang.toUpperCase()]
    );
  }
  assert.deepEqual(rental.getRateDetails(original.trip.rateDetailsId), original);
});

// Execute the actual confirmation handlers with navigation and hooks isolated;
// browser interactions are still left to human acceptance.
let slots = [],
  cursor = 0,
  context,
  effects = [],
  pushed = [];
const hooks = {
  ...React,
  useState: (initial) => {
    const i = cursor++;
    if (!(i in slots)) slots[i] = initial;
    return [
      slots[i],
      (value) => {
        slots[i] = value;
      },
    ];
  },
  useRef: (initial) => {
    const i = cursor++;
    return (slots[i] ??= { current: initial });
  },
  useCallback: (fn) => fn,
  useContext: () => context,
  useId: () => 'driver-form',
  useEffect: (fn) => effects.push(fn),
  useSyncExternalStore: (_, snapshot) => snapshot(),
};
Module._load = function (name, parent, ...rest) {
  if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
  if (parent?.filename.endsWith('/LocaleNavigation.tsx')) {
    if (name === 'react') return hooks;
    if (name === 'next/navigation')
      return {
        useRouter: () => ({ push: (href) => pushed.push(href) }),
        usePathname: () => window.location.pathname,
        useSearchParams: () => new URLSearchParams(window.location.search),
      };
    if (name === 'next/link') return 'a';
    if (name === '@/shared/ui/button') return { Button: 'button' };
    if (name === '@/shared/ui/dialog')
      return {
        Dialog: 'dialog',
        DialogContent: 'section',
        DialogTitle: 'h2',
        DialogDescription: 'p',
      };
  }
  return load.call(this, name, parent, ...rest);
};
global.document = { cookie: '' };
global.window = {
  location: new URL('https://trustgo.invalid/en/book/driver?rateDetailsId=original'),
};
const {
  LocaleNavigationProvider,
  LocaleSwitchLink,
  useUnsavedLocaleChanges,
} = require('../src/i18n/LocaleNavigation.tsx');
function provider() {
  cursor = 0;
  const tree = LocaleNavigationProvider({ lang: 'en', children: null });
  context = tree.props.value;
  return tree;
}
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) {
    const found = find(child, predicate);
    if (found) return found;
  }
}
test('switching language needs explicit confirmation when driver details are unsaved; cancel preserves the form', () => {
  provider();
  useUnsavedLocaleChanges(true);
  const cleanup = effects.pop()();
  let navigated = 0;
  const destination = {
    href: '/ja/book/driver?rateDetailsId=original',
    lang: 'ja',
    onNavigate: () => navigated++,
  };
  context.request(destination);
  let tree = provider();
  assert.equal(find(tree, (x) => x.type === 'dialog').props.open, true);
  assert.deepEqual(pushed, []);
  assert.equal(document.cookie, '');
  find(tree, (x) => x.type === 'button' && x.props.variant === 'secondary').props.onClick();
  assert.equal(find(provider(), (x) => x.type === 'dialog').props.open, false);
  assert.deepEqual(pushed, []);
  assert.equal(navigated, 0);
  context.request(destination);
  tree = provider();
  find(tree, (x) => x.type === 'button' && !x.props.variant).props.onClick();
  assert.deepEqual(pushed, [destination.href]);
  assert.equal(navigated, 1);
  assert.ok(document.cookie.startsWith('tg_locale=ja;'));
  cleanup();
});
test('clean forms navigate immediately and link destinations react to the current search parameters', () => {
  context.request({ href: '/ko/rent?pickupStoreCode=KLDJ01', lang: 'ko' });
  assert.equal(pushed.at(-1), '/ko/rent?pickupStoreCode=KLDJ01');
  const link = () => {
    let tree = LocaleSwitchLink({ lang: 'ja', children: '日本語' }).props.children;
    while (typeof tree.type === 'function') tree = tree.type(tree.props);
    return tree;
  };
  assert.equal(
    new URL(link().props.href, window.location).searchParams.get('rateDetailsId'),
    'original'
  );
  window.location.search = '?rateDetailsId=next&insurance=zero-excess';
  assert.equal(
    new URL(link().props.href, window.location).searchParams.get('rateDetailsId'),
    'next'
  );
});
test('payment presents the reservation contact email without an editable field that cannot be saved', () => {
  const { StripeCardForm } = require('../src/modules/checkout/ui/StripeCardForm.tsx');
  const html = renderToStaticMarkup(
    React.createElement(StripeCardForm, {
      amount: 100,
      currency: 'USD',
      isProcessing: false,
      driverEmail: 'booking@example.invalid',
      onPay: async () => {},
    })
  );
  assert.ok(html.includes('booking@example.invalid'));
  assert.ok(!html.includes('type="email"'));
});
test('the leave confirmation is translated in every supported language', () => {
  for (const lang of routeLanguages)
    for (const key of [
      'nav_language_leave_title',
      'nav_language_leave_description',
      'nav_language_stay',
      'nav_language_continue',
    ]) {
      assert.notEqual(getTranslation(key, lang), key);
      if (lang !== 'en') assert.notEqual(getTranslation(key, lang), getTranslation(key, 'en'));
    }
});
console.log(`\n${passed} site navigation checks passed (no browser or network).`);
