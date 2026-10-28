import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = join(process.cwd(), '.next/server/app');
const expected = { en: 'en', zh: 'zh-Hant', ja: 'ja', es: 'es', ko: 'ko' };
const counts = Object.fromEntries(Object.keys(expected).map((lang) => [lang, 0]));
let redirects = 0;
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = join(directory, entry.name);
    if (entry.isDirectory()) {
      await inspect(file);
      continue;
    }
    if (!entry.name.endsWith('.html')) continue;
    const lang = relative(root, file).match(/^(en|zh|ja|es|ko)(?:\/|\.html$)/)?.[1];
    if (!lang) continue;
    // Next emits its own minimal document for redirects; inspect the actual response metadata.
    const metadata = JSON.parse(await readFile(file.replace(/\.html$/, '.meta'), 'utf8'));
    if ([301, 302, 303, 307, 308].includes(metadata.status)) {
      assert.ok(
        metadata.headers.location.startsWith(`/${lang}/`),
        `${file}: redirect must keep its language`
      );
      redirects++;
      continue;
    }
    const html = await readFile(file, 'utf8');
    assert.equal(
      (html.match(/<html\b/g) ?? []).length,
      1,
      `${file}: document must have one html element`
    );
    assert.equal(
      (html.match(/<body\b/g) ?? []).length,
      1,
      `${file}: document must have one body element`
    );
    assert.equal(
      html.match(/<html\b[^>]*\blang="([^"]+)"/)?.[1],
      expected[lang],
      `${file}: wrong document language`
    );
    assert.ok(!html.includes('fonts.googleapis.com'), `${file}: font loading must be local`);
    counts[lang]++;
  }
}
await inspect(root);
for (const [lang, count] of Object.entries(counts))
  assert.ok(count > 0, `No built HTML for ${lang}; run npm run build first`);
console.log(
  'Built HTML: one document, correct initial language and no Google Fonts dependency.',
  counts
);
console.log(`${redirects} redirect responses preserve their route language.`);
