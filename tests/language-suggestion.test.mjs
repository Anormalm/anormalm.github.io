import test from 'node:test';
import assert from 'node:assert/strict';
import { languageForCountry } from '../src/lib/languageSuggestion.js';
import { translationUrl } from '../src/data/siteLanguages.js';
import { AUTO_LANGUAGE_KEY, createIpLanguageResolver, LANGUAGE_CHOICE_KEY, readLanguageChoice, translationDestination } from '../src/lib/automaticLanguage.js';

const memoryStorage = (initial = []) => {
  const values = new Map(initial);
  return { values, getItem: (key) => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
};
const countryResponse = (country) => ({ ok: true, json: async () => ({ country, ip: '192.0.2.1' }) });

test('IP country selects a concrete language without any browser preference input', () => {
  for (const [country, language] of [['CN', 'zh'], ['JP', 'ja'], ['DE', 'de'], ['HU', 'hu'], ['TW', 'zh-TW'], ['HK', 'zh-TW'], ['SG', 'en'], ['IN', 'hi'], ['AE', 'ar']]) {
    assert.equal(languageForCountry(country).code, language, country);
  }
});

test('unknown country data falls back to English safely', () => {
  for (const country of [null, {}, '__proto__', 'constructor', '', 'ZZ']) assert.equal(languageForCountry(country).code, 'en');
  assert.equal(languageForCountry(' cn ').code, 'zh');
});

test('an explicit URL language overrides saved preference and disables country detection', () => {
  const storage = memoryStorage([[LANGUAGE_CHOICE_KEY, 'ja']]);
  assert.equal(readLanguageChoice('?lang=en', storage), 'en');
  assert.equal(readLanguageChoice('?lang=zh', storage), 'zh');
  assert.equal(readLanguageChoice('', storage), 'ja');
});

test('legacy automatic English is not mistaken for a manual choice; Chinese is preserved', () => {
  assert.equal(readLanguageChoice('', memoryStorage([['site-language', 'en']])), null);
  assert.equal(readLanguageChoice('', memoryStorage([['site-language', 'zh']])), 'zh');
  assert.equal(readLanguageChoice('', memoryStorage([[LANGUAGE_CHOICE_KEY, 'en'], ['site-language', 'zh']])), 'en');
  assert.equal(readLanguageChoice('?lang=bogus', memoryStorage([[LANGUAGE_CHOICE_KEY, 'bogus']])), null);
});

test('startup performs one lookup even when called twice and persists only a language code', async () => {
  const storage = memoryStorage();
  let requests = 0;
  const resolve = createIpLanguageResolver({
    storage,
    fetcher: async (url, options) => {
      requests += 1;
      assert.equal(url, 'https://api.country.is/');
      assert.equal(options.credentials, 'omit');
      assert.equal(options.referrerPolicy, 'no-referrer');
      return countryResponse('JP');
    },
  });
  assert.deepEqual(await Promise.all([resolve(), resolve()]), ['ja', 'ja']);
  assert.equal(requests, 1);
  assert.deepEqual([...storage.values], [[AUTO_LANGUAGE_KEY, 'ja']]);
});

test('a cached session language avoids another IP lookup on reload', async () => {
  const resolve = createIpLanguageResolver({ storage: memoryStorage([[AUTO_LANGUAGE_KEY, 'fr']]), fetcher: () => assert.fail('No lookup expected') });
  assert.equal(await resolve(), 'fr');
});

test('network errors, bad JSON, and invalid payloads keep the site usable in English', async () => {
  for (const fetcher of [
    async () => { throw new Error('Offline'); },
    async () => ({ ok: false }),
    async () => ({ ok: true, json: async () => { throw new Error('Bad JSON'); } }),
    async () => ({ ok: true, json: async () => null }),
    async () => countryResponse(null),
  ]) {
    const resolve = createIpLanguageResolver({ fetcher, storage: memoryStorage() });
    assert.equal(await resolve(), 'en');
  }
});

test('a stalled service times out and cancels its request', async () => {
  let signal;
  const resolve = createIpLanguageResolver({
    timeoutMs: 5,
    fetcher: async (_url, options) => { signal = options.signal; return new Promise(() => {}); },
  });
  assert.equal(await resolve(), 'en');
  assert.equal(signal.aborted, true);
});

test('blocked browser storage does not break a lookup or explicit URL choice', async () => {
  const storage = { getItem: () => { throw new Error('Blocked'); }, setItem: () => { throw new Error('Blocked'); } };
  assert.equal(readLanguageChoice('?lang=en', storage), 'en');
  assert.equal(readLanguageChoice('', storage), null);
  assert.equal(await createIpLanguageResolver({ fetcher: async () => countryResponse('CN'), storage })(), 'zh');
});

test('native languages stay on the website and translated ones allow Back without redirect loops', () => {
  const storage = memoryStorage();
  assert.equal(translationDestination('en', '/cv', storage), null);
  assert.equal(translationDestination('zh', '/cv', storage), null);
  assert.ok(translationDestination('hu', '/cv', storage).startsWith('https://translate.google.com/translate?'));
  assert.equal(translationDestination('hu', '/cv', storage), null);
});

test('translated deep links retain the route and anchor, use English source, and do not share arbitrary queries', () => {
  const target = new URL(translationUrl('ja', '/cv?private=value#album'));
  assert.equal(target.searchParams.get('tl'), 'ja');
  const source = new URL(target.searchParams.get('u'));
  assert.equal(source.origin, 'https://anormalm.com');
  assert.equal(source.pathname, '/translate/');
  assert.equal(source.searchParams.get('redirect'), '/cv?lang=en#album');
  assert.equal(source.href.includes('private'), false);
  assert.equal(translationUrl('bogus', '/'), null);
  assert.equal(translationUrl('ja', '/\\evil.example/'), null);
});
