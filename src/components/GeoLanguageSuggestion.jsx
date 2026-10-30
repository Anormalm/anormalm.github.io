import { useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiCheck, FiGlobe } from 'react-icons/fi';
import { useLanguage } from '../context/LanguageContext';
import { suggestSiteLanguages } from '../lib/languageSuggestion';
import { translationUrl } from '../data/siteLanguages';

// Mounted only after the visitor chooses to reveal their city. No new lookup,
// persistence, or automatic language switch is needed to offer these choices.
const GeoLanguageSuggestion = ({ countryCode }) => {
  const { language, isChinese, setLanguage } = useLanguage();
  const { pathname } = useLocation();
  const preferences = navigator.languages?.length ? navigator.languages : [navigator.language];
  const suggestion = suggestSiteLanguages(preferences, countryCode);
  const heading = suggestion.source === 'browser'
    ? (isChinese ? '浏览器推荐的语言' : 'Your browser suggests')
    : suggestion.source === 'country'
      ? (isChinese ? '当地常用语言' : 'Common languages here')
      : (isChinese ? '用你熟悉的语言' : 'Make yourself at home');

  return (
    <div className="geo-language-suggestion">
      <p aria-live="polite"><FiGlobe aria-hidden="true" /> {heading}</p>
      {!!suggestion.languages.length && (
        <div className="geo-language-options">
          {suggestion.languages.map((item) => {
            const name = <strong lang={item.code === 'zh' ? 'zh-CN' : item.code} dir={item.direction || 'auto'} translate="no">{item.nativeName}</strong>;
            return item.local ? (
              <button key={item.code} type="button" onClick={() => setLanguage(item.code)} aria-pressed={language === item.code}>
                {name}
                {language === item.code
                  ? <><FiCheck aria-hidden="true" /><small>{isChinese ? '已选' : 'Selected'}</small></>
                  : <small>{isChinese ? '切换' : 'Switch'}</small>}
              </button>
            ) : (
              <a key={item.code} href={translationUrl(item.code, pathname)} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} — ${isChinese ? '在新标签页打开 Google 自动翻译' : 'open automatic Google translation in a new tab'}`}>
                {name}<small>Google Translate</small><FiArrowUpRight aria-hidden="true" />
              </a>
            );
          })}
        </div>
      )}
      <button type="button" className="geo-language-more" onClick={() => window.dispatchEvent(new Event('anormalm:languages'))}>
        {isChinese ? '选择其他语言' : 'Choose another language'} <span aria-hidden="true">→</span>
      </button>
    </div>
  );
};

export default GeoLanguageSuggestion;
