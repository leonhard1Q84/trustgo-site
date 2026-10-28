/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');

require.extensions['.ts'] = (module, filename) =>
  module._compile(
    ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    }).outputText,
    filename
  );

const {
  locationCards,
  citiesList,
  marketsList,
} = require('../src/modules/locations/domain/locations-data.ts');
const {
  filterLocatorStores,
  resolveLocatorDestination,
} = require('../src/modules/locations/domain/store-locator-filters.ts');
const defaults = {
  market: 'all',
  city: 'all',
  airport: false,
  cityStore: false,
  selfServiceOnly: false,
  oneWayOnly: false,
  searchQuery: '',
};
const search = (filters, language = 'EN') =>
  filterLocatorStores(locationCards, { ...defaults, ...filters }, language);
const codes = (stores) => stores.map((store) => store.code).sort();
let passed = 0;
function test(name, check) {
  check();
  passed++;
  console.log(`✓ ${name}`);
}

test('city selection carries its country and rejects mismatched or unknown destinations', () => {
  assert.deepEqual(resolveLocatorDestination('all', 'narita'), { market: 'JP', city: 'narita' });
  assert.deepEqual(resolveLocatorDestination('TW', 'narita'), { market: 'TW', city: 'all' });
  assert.deepEqual(resolveLocatorDestination('unknown', 'unknown'), { market: 'all', city: 'all' });
  assert.deepEqual(resolveLocatorDestination('jp', 'NARITA'), { market: 'JP', city: 'narita' });
});
test('country groups partition the directory and every city returns only its own stores', () => {
  const countries = marketsList.filter((item) => item.code !== 'all');
  assert.equal(
    countries.reduce((count, item) => count + search({ market: item.code }).length, 0),
    locationCards.length
  );
  for (const city of citiesList) {
    const stores = search(resolveLocatorDestination(city.marketCode, city.code));
    assert.ok(stores.length > 0, city.code);
    assert.ok(
      stores.every((store) => store.marketCode === city.marketCode && store.cityCode === city.code)
    );
  }
});
test('airport and downtown/station types form a union when both are selected', () => {
  const airport = search({ airport: true });
  const city = search({ cityStore: true });
  assert.ok(airport.length && city.length);
  assert.ok(airport.every((store) => store.storeType === 'airport'));
  assert.ok(city.every((store) => store.storeType !== 'airport'));
  assert.deepEqual(codes(search({ airport: true, cityStore: true })), codes(locationCards));
});
test('self-service and one-way capabilities intersect with the chosen country and city', () => {
  const filters = {
    market: 'JP',
    city: 'tokyo',
    cityStore: true,
    selfServiceOnly: true,
    oneWayOnly: true,
  };
  const expected = locationCards.filter(
    (store) =>
      store.marketCode === 'JP' &&
      store.cityCode === 'tokyo' &&
      store.storeType !== 'airport' &&
      store.selfService &&
      store.oneWay
  );
  assert.deepEqual(codes(search(filters)), codes(expected));
  assert.deepEqual(search({ market: 'TW', searchQuery: 'Narita' }), []);
});
test('localized country and city names are searchable in all five languages', () => {
  for (const lang of ['EN', 'ZH', 'JA', 'ES', 'KO']) {
    const country = marketsList.find((item) => item.code === 'TH');
    assert.deepEqual(
      codes(search({ searchQuery: country.label[lang] }, lang)),
      codes(search({ market: 'TH' }))
    );
    const city = citiesList.find((item) => item.code === 'narita');
    assert.deepEqual(
      codes(search({ searchQuery: `  ${city.localizedNames[lang]}  ` }, lang)),
      codes(search({ city: 'narita' }))
    );
  }
});
test('reset returns every station after destination, services and keyword filters', () => {
  search({ market: 'TW', airport: true, selfServiceOnly: true, searchQuery: 'not-a-station' });
  assert.deepEqual(codes(search(defaults)), codes(locationCards));
});
console.log(`${passed} location filter checks passed.`);
