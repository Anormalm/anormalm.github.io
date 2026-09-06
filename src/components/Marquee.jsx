import { useLanguage } from '../context/LanguageContext';

const DEFAULT_ITEMS = ['Graph ML', 'Language Models', 'Edge AI', 'Adaptive Systems', 'Creative Code'];
const DEFAULT_ITEMS_ZH = ['图机器学习', '语言模型', '边缘智能', '自适应系统', '创意编程'];

const Marquee = ({ items = DEFAULT_ITEMS }) => {
  const { isChinese } = useLanguage();
  const displayItems = isChinese && items === DEFAULT_ITEMS ? DEFAULT_ITEMS_ZH : items;
  const loop = [...displayItems, ...displayItems];

  return (
    <div className="marquee-shell" aria-label={displayItems.join(', ')}>
      <div className="marquee-track" aria-hidden="true">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} className="marquee-item">
            {item}<span className="marquee-star">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
