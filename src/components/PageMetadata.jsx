import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { canonicalUrl, pageForPath } from '../data/pages';

const PageMetadata = () => {
  const { pathname } = useLocation();
  const { isChinese, language, t } = useLanguage();

  useEffect(() => {
    const page = pageForPath(pathname);
    const title = t(isChinese ? page.titleZh : page.title);
    const description = t(page.description);
    document.title = title;
    document.querySelector('link[rel="canonical"]').href = canonicalUrl(pathname);
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', title],
      ['meta[property="og:description"]', description],
      ['meta[property="og:url"]', canonicalUrl(pathname)],
      ['meta[name="twitter:title"]', title],
      ['meta[name="twitter:description"]', description],
      ['meta[name="robots"]', page.noindex ? 'noindex, follow' : 'index, follow'],
    ]) {
      const element = document.querySelector(selector);
      if (element) element.content = content;
    }
  }, [isChinese, language, pathname, t]);

  return null;
};

export default PageMetadata;
