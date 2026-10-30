import { SITE_LANGUAGES } from '../data/siteLanguages.js';

// The first entry is the country default, not a claim about an individual.
// Browser language does not participate in IP-based selection.
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
  BD: ['bn'], LK: ['en', 'ta'], TH: ['th'], VN: ['vi'], ID: ['id'],
};

export const languageForCountry = (countryCode) => {
  const country = typeof countryCode === 'string' ? countryCode.trim().toUpperCase() : '';
  const code = Object.hasOwn(COUNTRY_LANGUAGES, country) ? COUNTRY_LANGUAGES[country][0] : 'en';
  return SITE_LANGUAGES.find((item) => item.code === code) || SITE_LANGUAGES[0];
};
