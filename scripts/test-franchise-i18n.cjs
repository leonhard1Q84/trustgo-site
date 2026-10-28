/* eslint-disable @typescript-eslint/no-require-imports */
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const root = path.resolve(__dirname, '..');
const projectRequire = Module.createRequire(path.join(root, 'package.json'));
const ts = projectRequire('typescript');
const React = projectRequire('react');
const { renderToStaticMarkup } = projectRequire('react-dom/server');
const resolve = Module._resolveFilename;
const load = Module._load;
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
const { getTranslation: t } = projectRequire('./src/i18n/translation.ts');
const { routeLanguages, htmlLangMap } = projectRequire('./src/i18n/locales.ts');
Module._load = function (name, parent, ...rest) {
  if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
  return load.call(this, name, parent, ...rest);
};
const { FranchiseContent } = projectRequire('./src/modules/franchise/ui/FranchiseContent.tsx');
const { PartnershipForm } = projectRequire('./src/modules/franchise/ui/PartnershipForm.tsx');
const escape = (value) =>
  renderToStaticMarkup(React.createElement('span', null, value)).slice(6, -7);
for (const lang of routeLanguages) {
  const page = renderToStaticMarkup(React.createElement(FranchiseContent, { lang }));
  const form = renderToStaticMarkup(React.createElement(PartnershipForm, { lang }));
  for (const key of [
    'franchise_hero_desc',
    'franchise_stat_regions',
    'franchise_ecosystem_title',
    'franchise_ecosystem_desc',
    'franchise_dashboard_channels',
    'franchise_dashboard_pricing',
    'franchise_dashboard_bookings',
    'franchise_dashboard_dispatch',
    'franchise_core_hub',
    'franchise_always_online',
  ]) {
    assert.ok(page.includes(escape(t(key, lang))), `${lang} page missing ${key}`);
  }
  for (const key of [
    'franchise_fleet_size',
    'franchise_fleet_under_20',
    'franchise_fleet_20_50',
    'franchise_fleet_50_200',
    'franchise_fleet_over_200',
    'franchise_goals',
  ]) {
    assert.ok(form.includes(escape(t(key, lang))), `${lang} form missing ${key}`);
  }
  assert.ok(page.includes(new Intl.NumberFormat(htmlLangMap[lang]).format(1284)));
  assert.doesNotMatch(page + form, /franchise_[a-z_0-9]+/);
  if (['en', 'es', 'ko'].includes(lang)) assert.doesNotMatch(page + form, /\p{Script=Han}/u);
  console.log(`${lang}: localized page, form, number formatting and no unresolved keys passed`);
  if (process.argv.includes('--build')) {
    const built = fs.readFileSync(
      path.join(root, '.next/server/app', lang, 'franchise.html'),
      'utf8'
    );
    const main = built.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
    assert.ok(main, `${lang}: missing main content in built HTML`);
    assert.equal((built.match(/<h1\b/g) ?? []).length, 1);
    assert.equal((built.match(/<title>/g) ?? []).length, 1);
    assert.ok(
      built.includes(
        `<title>${escape(t('franchise_hero_title', lang))} | TrustGo Car Rental</title>`
      )
    );
    assert.ok(
      built.includes(`name="description" content="${escape(t('franchise_hero_desc', lang))}"`)
    );
    const canonical = built.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    assert.ok(canonical?.endsWith(`/${lang}/franchise/`));
    for (const alternate of [...routeLanguages.map((route) => htmlLangMap[route]), 'x-default']) {
      assert.ok(
        built.includes(`hrefLang="${alternate}"`),
        `${lang}: missing ${alternate} alternate`
      );
    }
    assert.ok(built.includes('name="robots" content="index, follow"'));
    assert.ok(main.includes(escape(t('franchise_ecosystem_title', lang))));
    assert.ok(main.includes(escape(t('franchise_dashboard_bookings', lang))));
    assert.doesNotMatch(main, /franchise_[a-z_0-9]+/);
    if (['en', 'es', 'ko'].includes(lang)) assert.doesNotMatch(main, /\p{Script=Han}/u);
    console.log(`${lang}: production HTML, title, description, canonical and hreflang passed`);
  }
}
// Exercise the real form handlers with only React state and transport replaced.
let slots = [],
  cursor = 0;
const hooks = {
  useState(initial) {
    const i = cursor++;
    if (!(i in slots)) slots[i] = initial;
    return [
      slots[i],
      (value) => {
        slots[i] = typeof value === 'function' ? value(slots[i]) : value;
      },
    ];
  },
  useRef(initial) {
    const i = cursor++;
    return (slots[i] ??= { current: initial });
  },
};
Module._load = function (name, parent, ...rest) {
  if (name === 'lucide-react') return new Proxy({}, { get: () => () => null });
  if (parent?.filename.endsWith('/PartnershipForm.tsx')) {
    if (name === 'react') return hooks;
    if (name === '@/i18n/useI18n') return { useI18n: (lang) => ({ t: (key) => t(key, lang) }) };
  }
  return load.call(this, name, parent, ...rest);
};
const formPath = projectRequire.resolve('./src/modules/franchise/ui/PartnershipForm.tsx');
delete require.cache[formPath];
const { PartnershipForm: InteractiveForm } = projectRequire(formPath);
function find(tree, predicate) {
  if (!tree || typeof tree !== 'object') return;
  if (predicate(tree)) return tree;
  for (const child of [tree.props?.children].flat(Infinity)) {
    const match = find(child, predicate);
    if (match) return match;
  }
}
const formData = new Map([
  ['contactName', 'Test'],
  ['company', 'Test Rentals'],
  ['email', 'test@example.invalid'],
  ['consent', 'on'],
]);
global.FormData = class {
  get(key) {
    return formData.get(key);
  }
};
(async () => {
  for (const lang of routeLanguages) {
    slots = [];
    const render = () => {
      cursor = 0;
      return InteractiveForm({ lang });
    };
    const chip = (tree, key) =>
      find(tree, (n) => n.type === 'button' && n.props.children === t(key, lang));
    let tree = render();
    find(tree, (n) => n.type === 'textarea').props.onChange({
      target: { value: 'Tokyo operations' },
    });
    chip(render(), 'franchise_fleet_under_20').props.onClick();
    chip(render(), 'franchise_fleet_over_200').props.onClick();
    tree = render();
    assert.equal(find(tree, (n) => n.type === 'textarea').props.value, 'Tokyo operations');
    assert.equal(chip(tree, 'franchise_fleet_over_200').props['aria-pressed'], true);
    let sent;
    global.fetch = async (url, options) => {
      assert.equal(url, '/api/franchise-applications');
      sent = JSON.parse(options.body);
      return Response.json({ accepted: false }, { status: 503 });
    };
    const form = {
      querySelector() {
        return { focus() {} };
      },
      reset() {},
    };
    await tree.props.onSubmit({ preventDefault() {}, currentTarget: form });
    assert.equal(sent.lang, lang);
    assert.equal(sent.help, `[${t('franchise_fleet_over_200', lang)}] Tokyo operations`);
    tree = render();
    assert.ok(
      find(tree, (n) => n.type === 'p' && n.props.children === t('franchise_unavailable', lang))
    );
    assert.equal(find(tree, (n) => n.type === 'textarea').props.value, 'Tokyo operations');
    chip(tree, 'franchise_fleet_over_200').props.onClick();
    tree = render();
    assert.equal(chip(tree, 'franchise_fleet_over_200').props['aria-pressed'], false);
    global.fetch = async (url, options) => {
      sent = JSON.parse(options.body);
      return Response.json({ accepted: true });
    };
    await tree.props.onSubmit({ preventDefault() {}, currentTarget: form });
    assert.equal(sent.help, 'Tokyo operations');
    tree = render();
    assert.ok(
      find(tree, (n) => n.type === 'h3' && n.props.children === t('franchise_success', lang))
    );
    assert.ok(
      find(tree, (n) => n.type === 'span' && n.props.children === t('franchise_copy', lang))
    );
    console.log(
      `${lang}: chip replacement/toggle, preserved notes, localized payload, unavailable and success states passed (stub transport only)`
    );
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
