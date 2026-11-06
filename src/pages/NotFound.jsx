import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NotFound = () => {
  const { isChinese } = useLanguage();
  return (
    <section className="section">
      <div className="tech-panel rounded-3xl p-8 md:p-12">
        <div className="eyebrow">404</div>
        <h1 className="font-display mt-4 text-4xl">{isChinese ? '页面未找到' : 'Page not found'}</h1>
        <Link to="/" className="button-primary mt-8">{isChinese ? '返回首页' : 'Return Home'}</Link>
      </div>
    </section>
  );
};

export default NotFound;
