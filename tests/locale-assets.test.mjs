import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { SITE_LANGUAGES } from '../src/data/siteLanguages.js';

const readPack = async (code) => JSON.parse(await readFile(new URL(`../src/locales/${code}.json`, import.meta.url), 'utf8'));
const english = await readPack('en');
const keys = Object.keys(english).sort();
const placeholders = (text) => [...text.matchAll(/\{\d+\}/g)].map((match) => match[0]).sort();
const required = [
  'I build systems that think and move.',
  'Choose a language',
  'Computer Engineering at NUS. Working across machine learning research and systems.',
  'I’m a Computer Engineering student at NUS in Singapore.',
  'Translations are stored with the site. Technical names and PDFs keep their original wording.',
];

for (const locale of SITE_LANGUAGES) {
  test(`${locale.locale}: complete local catalog with intact variable placeholders`, async () => {
    const pack = await readPack(locale.code);
    assert.deepEqual(Object.keys(pack).sort(), keys);
    for (const key of keys) {
      assert.equal(typeof pack[key], 'string', key);
      assert.ok(pack[key].trim(), `Empty message: ${key}`);
      assert.deepEqual(placeholders(pack[key]), placeholders(key), `Changed placeholders: ${key}`);
    }
    if (locale.code !== 'en') {
      for (const key of required) assert.notEqual(pack[key], english[key], `Required translation missing: ${key}`);
      const changed = keys.filter((key) => pack[key] !== english[key]).length;
      assert.ok(changed >= 480, `Only ${changed} messages localized; code and proper names may remain unchanged.`);
    }
  });
}
