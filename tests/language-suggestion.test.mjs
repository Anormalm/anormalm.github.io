import test from 'node:test';
import assert from 'node:assert/strict';
import { supportedBrowserLanguage, suggestSiteLanguages } from '../src/lib/languageSuggestion.js';

test('browser preferences take priority over an IP-derived country, including while travelling', () => {
  const result = suggestSiteLanguages(['fr-CA', 'en-US'], 'HU');
  assert.equal(result.source, 'browser');
  assert.deepEqual(result.languages.map(({ code }) => code), ['fr']);
});

test('unsupported or malformed first choices do not hide a supported second preference', () => {
  const result = suggestSiteLanguages(['invalid_locale', 'sw-KE', 'de-AT', 'en'], 'SG');
  assert.equal(result.source, 'browser');
  assert.equal(result.languages[0].code, 'de');
});

test('Chinese script preference takes priority over region', () => {
  assert.equal(supportedBrowserLanguage('zh-Hant-SG').code, 'zh-TW');
  assert.equal(supportedBrowserLanguage('zh-Hans-TW').code, 'zh');
  assert.equal(supportedBrowserLanguage('zh-HK').code, 'zh-TW');
  assert.equal(supportedBrowserLanguage('zh-CN').code, 'zh');
});

test('regional tags and common legacy language codes resolve to available choices', () => {
  for (const [tag, expected] of [['pt-BR', 'pt'], ['nb-NO', 'no'], ['nn', 'no'], ['iw-IL', 'he'], ['in-ID', 'id']]) {
    assert.equal(supportedBrowserLanguage(tag)?.code, expected, tag);
  }
});

test('multilingual country fallback offers options instead of a claimed exact match', () => {
  const result = suggestSiteLanguages(['sw'], ' sg ');
  assert.equal(result.source, 'country');
  assert.deepEqual(result.languages.map(({ code }) => code), ['en', 'zh', 'ms', 'ta']);
  assert.deepEqual(suggestSiteLanguages([], 'CH').languages.map(({ code }) => code), ['de', 'fr', 'it']);
});

test('unknown or malformed inputs give no invented recommendation', () => {
  for (const country of ['??', '', 'ZZ', null, '__proto__', 'constructor']) {
    assert.deepEqual(suggestSiteLanguages(null, country), { source: null, languages: [] });
  }
  for (const tag of [null, '', ' ', 123, 'not_a_locale', 'sw-KE']) {
    assert.equal(supportedBrowserLanguage(tag), null);
  }
});

test('recommendations preserve native versus external translation metadata', () => {
  assert.equal(suggestSiteLanguages(['zh-CN'], 'US').languages[0].local, true);
  assert.equal(suggestSiteLanguages(['ar'], 'US').languages[0].direction, 'rtl');
  assert.equal(suggestSiteLanguages(['ja'], 'US').languages[0].local, undefined);
});
