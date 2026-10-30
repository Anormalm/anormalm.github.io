import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiCheck, FiGlobe, FiSearch, FiX } from 'react-icons/fi';
import { SITE_LANGUAGES } from '../data/siteLanguages';
import { useLanguage } from '../context/LanguageContext';

const LanguagePicker = () => {
  const { language, isChinese, setLanguage, languageLoading, languageError, t } = useLanguage();
  const dialogRef = useRef(null);
  const [query, setQuery] = useState('');
  useEffect(() => {
    const openPicker = () => {
      setQuery('');
      if (!dialogRef.current?.open) dialogRef.current?.showModal();
    };
    window.addEventListener('anormalm:languages', openPicker);
    return () => window.removeEventListener('anormalm:languages', openPicker);
  }, []);

  const selectLanguage = async (code) => {
    if (await setLanguage(code)) dialogRef.current?.close();
  };
  const normalized = query.trim().toLocaleLowerCase();
  const options = SITE_LANGUAGES.filter((item) => `${t(item.name)} ${item.name} ${item.nativeName} ${item.code} ${item.locale}`.toLocaleLowerCase().includes(normalized));

  return createPortal(
    <dialog ref={dialogRef} className="language-picker" aria-labelledby="language-picker-title" aria-describedby="language-picker-note" onKeyDown={(event) => event.stopPropagation()} onClick={(event) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current.close();
    }}>
      <div className="language-picker-header">
        <div><FiGlobe aria-hidden="true" /><h2 id="language-picker-title">{isChinese ? '选择语言' : 'Choose a language'}</h2><span>{SITE_LANGUAGES.length}</span></div>
        <button type="button" className="icon-button" onClick={() => dialogRef.current?.close()} aria-label={isChinese ? '关闭语言选择' : 'Close language picker'}><FiX /></button>
      </div>
      <label className="language-picker-search"><FiSearch aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isChinese ? '搜索语言…' : 'Find your language…'} aria-label={isChinese ? '搜索语言' : 'Search languages'} /></label>
      <div className="language-picker-options" aria-busy={languageLoading}>
        <div className="language-picker-grid">
          {options.map((item) => <button type="button" key={item.code} onClick={() => selectLanguage(item.code)} aria-pressed={language === item.code}>
            <span><strong lang={item.locale} dir={item.direction || 'auto'} translate="no">{item.nativeName}</strong><small translate="no" dir="ltr">{item.locale}</small></span>
            {language === item.code && <FiCheck aria-hidden="true" />}
          </button>)}
        </div>
        {!options.length && <p className="language-picker-empty">{isChinese ? '未找到匹配的语言。' : 'No matching language.'}</p>}
        {languageLoading && <p role="status">{isChinese ? '正在加载语言…' : 'Loading language…'}</p>}
        {languageError && <p role="alert">{isChinese ? '语言暂时不可用，请重试。' : 'Language unavailable. Please try again.'}</p>}
      </div>
      <p id="language-picker-note" className="language-picker-note">{isChinese ? '所有语言都保留在本站。' : 'All languages stay on this website.'}</p>
    </dialog>, document.body,
  );
};

export default LanguagePicker;
