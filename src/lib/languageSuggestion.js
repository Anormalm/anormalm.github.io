import { SITE_LANGUAGES } from '../data/siteLanguages.js';

// Suggestions, not a claim about the visitor's identity or preferred language.
// Multilingual countries offer choices rather than treating one as certain.
const COUNTRY_LANGUAGES = {
  US: ['en'], GB: ['en'], AU: ['en'], NZ: ['en'], IE: ['en'], CA: ['en', 'fr'],
  CN: ['zh'], TW: ['zh-TW'], HK: ['zh-TW', 'en'], MO: ['zh-TW', 'pt'],
  SG: ['en', 'zh', 'ms', 'ta'], MY: ['ms', 'en', 'zh', 'ta'],
  JP: ['ja'], KR: ['ko'], FR: ['fr'], DE: ['de'], AT: ['de'],
  CH: ['de', 'fr', 'it'], BE: ['nl', 'fr', 'de'], ES: ['es'],
  MX: ['es'], AR: ['es'], CL: ['es'], CO: ['es'], PE: ['es'],
  PT: ['pt'], BR: ['pt'], IT: ['it'], NL: ['nl'], SE: ['sv'],
  NO: ['no'], FI: ['fi', 'sv'], PL: ['pl'], CZ: ['cs'], HU: ['hu'],
  RO: ['ro'], GR: ['el'], TR: ['tr'], UA: ['uk'], RU: ['ru'],
  SA: ['ar'], AE: ['ar', 'en'], EG: ['ar'], MA: ['ar', 'fr'],
  IL: ['he', 'ar'], IR: ['fa'], IN: ['hi', 'en', 'ta', 'bn'],
  BD: ['bn'], LK: ['ta', 'en'], TH: ['th'], VN: ['vi'], ID: ['id'],
};

export const supportedBrowserLanguage = (tag) => {
  if (typeof tag !== 'string' || !tag.trim()) return null;
  try {
    const locale = new Intl.Locale(tag.trim());
    let code = locale.language;
    if (code === 'zh') {
      // An explicit script wins over the region: zh-Hans-TW is Simplified.
      const traditional = locale.script
        ? locale.script === 'Hant'
        : ['TW', 'HK', 'MO'].includes(locale.region);
      code = traditional ? 'zh-TW' : 'zh';
    }
    if (code === 'nb' || code === 'nn') code = 'no';
    return SITE_LANGUAGES.find((item) => item.code === code) || null;
  } catch {
    return null;
  }
};

export const suggestSiteLanguages = (browserLanguages = [], countryCode = '') => {
  // The ordered browser preference list is more useful than an IP-derived city,
  // especially for travellers, VPN users, and multilingual regions.
  for (const tag of Array.isArray(browserLanguages) ? browserLanguages : []) {
    const match = supportedBrowserLanguage(tag);
    if (match) return { source: 'browser', languages: [match] };
  }

  const country = typeof countryCode === 'string' ? countryCode.trim().toUpperCase() : '';
  const codes = Object.hasOwn(COUNTRY_LANGUAGES, country) ? COUNTRY_LANGUAGES[country] : [];
  return {
    source: codes.length ? 'country' : null,
    languages: codes.map((code) => SITE_LANGUAGES.find((item) => item.code === code)),
  };
};
