import test from 'node:test';
import assert from 'node:assert/strict';
import { languageForCountry } from '../src/lib/languageSuggestion.js';
import { SITE_LANGUAGES, normalizeLanguageCode } from '../src/data/siteLanguages.js';
import { AUTO_LANGUAGE_KEY, createIpLanguageResolver, LANGUAGE_CHOICE_KEY, readLanguageChoice } from '../src/lib/automaticLanguage.js';
import { activateLocale, translate, translateProps } from '../src/i18n/translator.js';

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

test('32 native locales accept regional and underscore URL language codes', () => {
  assert.equal(SITE_LANGUAGES.length, 32);
  assert.ok(SITE_LANGUAGES.every((item) => item.local && item.locale));
  for (const [input, code] of [['en_US', 'en'], ['fr-FR', 'fr'], ['pt_BR', 'pt'], ['zh-Hant', 'zh-TW'], ['zh_Hans', 'zh'], ['nb-NO', 'no'], ['xx-XX', null]]) assert.equal(normalizeLanguageCode(input), code);
  assert.equal(readLanguageChoice('?lang=ja_JP', memoryStorage()), 'ja');
  assert.equal(SITE_LANGUAGES.find((item) => item.code === 'ar').direction, 'rtl');
});

test('stored messages translate dynamic counts while keeping variable values intact', () => {
  activateLocale('fr', { Home: 'Accueil', 'Round {0} of {1}': 'Manche {0} sur {1}', 'View {0} on GitHub': 'Voir {0} sur GitHub' });
  assert.equal(translate(' Home '), ' Accueil ');
  assert.equal(translate('Round 3 of 5'), 'Manche 3 sur 5');
  assert.equal(translate('View C-OS on GitHub'), 'Voir C-OS sur GitHub');
  assert.equal(translate('constructor'), 'constructor');
  assert.equal(translate('Untranslated proper name'), 'Untranslated proper name');
  activateLocale('en', {});
});

test('localization preserves the element structure, event handlers, refs, and animation values', () => {
  activateLocale('fr', { Home: 'Accueil' });
  const handler = () => {};
  const ref = {};
  const icon = { type: 'svg', props: {} };
  const props = { children: ['Home', icon], onClick: handler, ref, animate: { x: 10 }, href: '/cv', 'aria-label': 'Home' };
  const result = translateProps('button', props);
  assert.deepEqual(result.children, ['Accueil', icon]);
  assert.equal(result.onClick, handler);
  assert.equal(result.ref, ref);
  assert.equal(result.animate, props.animate);
  assert.equal(result.href, '/cv');
  assert.equal(result['aria-label'], 'Accueil');
  assert.equal(translateProps('code', props), props);
  assert.equal(translateProps('span', { ...props, translate: 'no' }).children[0], 'Home');
  activateLocale('en', {});
});
