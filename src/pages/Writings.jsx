import { FaMedium } from 'react-icons/fa';
import { FiArrowUpRight } from 'react-icons/fi';
import WritingCard from '../components/WritingCard';
import { writings } from '../data/portfolio';
import { useLanguage } from '../context/LanguageContext';

const Writings = () => {
  const { isChinese } = useLanguage();
  return (
    <div className="min-h-screen bg-grid">
      <section className="section">
        <div className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="WRITING">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">{isChinese ? '文章' : 'Writing'}</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">{isChinese ? '写在数学与 AI 的交界处。' : 'Notes from the boundary of math and AI.'}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                {isChinese
                  ? '关于模型架构、生产判断、拓扑学，以及连接研究与工程实践的那些想法。'
                  : 'Essays on model architecture, production judgment, topology, and the ideas that connect research to engineering practice.'}
              </p>
            </div>
            <a
              href="https://medium.com/@hulifan55555"
              target="_blank"
              rel="noopener noreferrer"
              className="button-secondary"
            >
              <FaMedium /> {isChinese ? 'Medium 主页' : 'Medium'} <FiArrowUpRight />
            </a>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {writings.map((writing) => (
            <WritingCard key={writing.title} {...writing} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Writings;
