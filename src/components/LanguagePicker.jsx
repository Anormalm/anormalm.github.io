import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation } from 'react-router-dom';
import { FiArrowUpRight, FiCheck, FiGlobe, FiSearch, FiX } from 'react-icons/fi';
import { SITE_LANGUAGES, translationUrl } from '../data/siteLanguages';
import { useLanguage } from '../context/LanguageContext';

const LanguagePicker = () => {
  const { language, isChinese, setLanguage } = useLanguage();
  const { pathname } = useLocation();
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

  const selectLanguage = (code) => {
    setLanguage(code);
    dialogRef.current?.close();
  };
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const options = SITE_LANGUAGES.filter((item) => `${item.name} ${item.nativeName} ${item.code}`.toLocaleLowerCase().includes(normalizedQuery));

  return createPortal(
    <dialog
      ref={dialogRef}
      className="language-picker"
      aria-labelledby="language-picker-title"
      aria-describedby="language-picker-note"
      onKeyDown={(event) => event.stopPropagation()}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialogRef.current.close();
      }}
    >
      <div className="language-picker-header">
        <div><FiGlobe aria-hidden="true" /><h2 id="language-picker-title">{isChinese ? '选择语言' : 'Choose a language'}</h2><span>{SITE_LANGUAGES.length}</span></div>
        <button type="button" className="icon-button" onClick={() => dialogRef.current?.close()} aria-label={isChinese ? '关闭语言选择' : 'Close language picker'}><FiX /></button>
      </div>
      <label className="language-picker-search">
        <FiSearch aria-hidden="true" />
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={isChinese ? '搜索语言…' : 'Find your language…'} aria-label={isChinese ? '搜索语言' : 'Search languages'} />
      </label>
      <div className="language-picker-options">
        {[true, false].map((local) => {
          const group = options.filter((item) => Boolean(item.local) === local);
          if (!group.length) return null;
          return (
            <section key={String(local)} aria-labelledby={`language-group-${local}`}>
              <h3 id={`language-group-${local}`}>{local ? (isChinese ? '本站版本' : 'On this site') : (isChinese ? 'Google 自动翻译 ↗' : 'Automatic · Google Translate ↗')}</h3>
              <div className="language-picker-grid">
                {group.map((item) => {
                  const label = <><span><strong lang={item.code === 'zh' ? 'zh-CN' : item.code} dir={item.direction || 'auto'} translate="no">{item.nativeName}</strong><small>{item.name}</small></span>{local ? (language === item.code && <FiCheck aria-hidden="true" />) : <FiArrowUpRight aria-hidden="true" />}</>;
                  return local ? (
                    <button type="button" key={item.code} onClick={() => selectLanguage(item.code)} aria-pressed={language === item.code}>{label}</button>
                  ) : (
                    <a key={item.code} href={translationUrl(item.code, pathname)} onClick={() => setLanguage(item.code)} target="_blank" rel="noopener noreferrer" aria-label={`${item.name} — ${isChinese ? '在新标签页打开 Google 翻译' : 'open Google Translate in a new tab'}`}>{label}</a>
                  );
                })}
              </div>
            </section>
          );
        })}
        {!options.length && <p className="language-picker-empty">{isChinese ? '未找到匹配的语言。' : 'No matching language.'}</p>}
      </div>
      <p id="language-picker-note" className="language-picker-note">{isChinese ? '首次访问时根据 IP 所在国家自动选择语言；你的手动选择优先。其他语言在 Google 翻译中打开，机器翻译可能有误。PDF 保留原文。' : 'Your IP country sets the initial language; your choice takes priority. Other languages open in Google Translate and may contain translation errors. PDFs stay in their original language.'}</p>
    </dialog>,
    document.body,
  );
};

export default LanguagePicker;
