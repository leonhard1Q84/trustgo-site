import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const sourceRoot = join(root, 'src');
const sourceExtensions = new Set(['.ts', '.tsx']);
const catalogs = {
  base: join(sourceRoot, 'i18n', 'catalog-base.ts'),
  ja: join(sourceRoot, 'i18n', 'catalog-ja.ts'),
  es: join(sourceRoot, 'i18n', 'catalog-es.ts'),
  ko: join(sourceRoot, 'i18n', 'catalog-ko.ts'),
};
const sharedCatalogs = [
  'catalog-customer-account-base.ts',
  'catalog-site-content.ts',
  'catalog-rate-details.ts',
  'catalog-franchise.ts',
  'catalog-checkout.ts',
  'catalog-booking-management.ts',
].map((file) => join(sourceRoot, 'i18n', file));

function extractKeys(content) {
  return new Set(
    [...content.matchAll(/^\s{2}(?:'([^']+)'|([A-Za-z0-9_]+)):/gm)].map(
      (match) => match[1] || match[2]
    )
  );
}

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(path)));
    } else if (sourceExtensions.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

const catalogContent = Object.fromEntries(
  await Promise.all(
    Object.entries(catalogs).map(async ([language, path]) => [
      language,
      await readFile(path, 'utf8'),
    ])
  )
);
// Fully translated feature catalogs share the same runtime lookup and validation.
catalogContent.base +=
  '\n' + (await Promise.all(sharedCatalogs.map((path) => readFile(path, 'utf8')))).join('\n');

const catalogKeys = Object.fromEntries(
  Object.entries(catalogContent).map(([language, content]) => [language, extractKeys(content)])
);

const violations = [];

// Partnership copy must be complete in every language; key alignment alone
// cannot detect Chinese text accidentally pasted into an English entry.
const franchiseCatalogPath = join(sourceRoot, 'i18n', 'catalog-franchise.ts');
const franchiseCatalog = ts.createSourceFile(
  franchiseCatalogPath,
  await readFile(franchiseCatalogPath, 'utf8'),
  ts.ScriptTarget.Latest,
  true
);
function inspectFranchiseTranslations(node) {
  if (ts.isPropertyAssignment(node) && ts.isObjectLiteralExpression(node.initializer)) {
    const key = node.name.getText(franchiseCatalog);
    for (const language of ['EN', 'ZH', 'JA', 'ES', 'KO']) {
      const entry = node.initializer.properties.find(
        (property) => property.name?.getText(franchiseCatalog) === language
      );
      const value =
        entry && ts.isPropertyAssignment(entry) && ts.isStringLiteralLike(entry.initializer)
          ? entry.initializer.text
          : '';
      if (!value.trim()) violations.push(`Franchise ${key} is missing ${language} copy`);
      if (['EN', 'ES', 'KO'].includes(language) && /\p{Script=Han}/u.test(value)) {
        violations.push(`Franchise ${key} contains Chinese copy in ${language}`);
      }
    }
  }
  ts.forEachChild(node, inspectFranchiseTranslations);
}
inspectFranchiseTranslations(franchiseCatalog);

// Parse object entries so interpolation such as {hours} inside a translation
// cannot be mistaken for the closing brace of its language record.
const fullyTranslatedKeys = new Set();
const catalogTree = ts.createSourceFile(
  'catalog.ts',
  catalogContent.base,
  ts.ScriptTarget.Latest,
  true
);
function inspectEntries(node) {
  if (ts.isPropertyAssignment(node) && ts.isObjectLiteralExpression(node.initializer)) {
    const languages = new Set(
      node.initializer.properties.map((property) =>
        property.name?.getText(catalogTree).replace(/['"]/g, '')
      )
    );
    if (['EN', 'ZH', 'JA', 'ES', 'KO'].every((language) => languages.has(language))) {
      fullyTranslatedKeys.add(node.name.getText(catalogTree).replace(/['"]/g, ''));
    }
  }
  ts.forEachChild(node, inspectEntries);
}
inspectEntries(catalogTree);

for (const language of ['ja', 'es', 'ko']) {
  const missing = [...catalogKeys.base].filter((key) => {
    if (catalogKeys[language].has(key)) return false;
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const inlineEntry = new RegExp(
      `^\\s{2}(?:'${escapedKey}'|${escapedKey}):\\s*\\{[^}]*\\b${language.toUpperCase()}:`,
      'm'
    );
    return !fullyTranslatedKeys.has(key) && !inlineEntry.test(catalogContent.base);
  });
  const extra = [...catalogKeys[language]].filter((key) => !catalogKeys.base.has(key));

  if (missing.length) {
    violations.push(
      `${language.toUpperCase()} catalog missing keys (${missing.length}): ${missing.join(', ')}`
    );
  }
  if (extra.length) {
    violations.push(
      `${language.toUpperCase()} catalog has unknown keys (${extra.length}): ${extra.join(', ')}`
    );
  }
}

for (const file of await walk(sourceRoot)) {
  if (Object.values(catalogs).includes(file)) continue;
  const content = await readFile(file, 'utf8');
  // Catch the original regression in page text, placeholders, chip options,
  // success states and accessibility labels, while ignoring code comments.
  if (file.startsWith(join(sourceRoot, 'modules', 'franchise', 'ui') + '/')) {
    const tree = ts.createSourceFile(file, content, ts.ScriptTarget.Latest, true);
    function inspectHardcodedCopy(node) {
      if (
        (ts.isJsxText(node) ||
          ts.isStringLiteralLike(node) ||
          node.kind === ts.SyntaxKind.TemplateHead ||
          node.kind === ts.SyntaxKind.TemplateMiddle ||
          node.kind === ts.SyntaxKind.TemplateTail) &&
        /\p{Script=Han}/u.test(node.text)
      ) {
        const { line } = tree.getLineAndCharacterOfPosition(node.getStart(tree));
        violations.push(
          `${relative(root, file)}:${line + 1} contains hardcoded Chinese copy; use the translation catalog`
        );
      }
      ts.forEachChild(node, inspectHardcodedCopy);
    }
    inspectHardcodedCopy(tree);
  }
  for (const match of content.matchAll(/\bt\(\s*['"]([^'"]+)['"]\s*\)/g)) {
    if (!catalogKeys.base.has(match[1])) {
      violations.push(`${relative(root, file)} uses missing translation key: ${match[1]}`);
    }
  }
}

if (violations.length > 0) {
  console.error('\n❌ i18n validation failed with violations:');
  for (const v of violations) {
    console.error(`  - ${v}`);
  }
  process.exit(1);
} else {
  console.log(
    `\n✅ i18n validation passed: ${catalogKeys.base.size} keys aligned across EN, ZH, JA, ES, KO.`
  );
}
