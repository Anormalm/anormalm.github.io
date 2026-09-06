import ProjectCard from '../components/ProjectCard';
import { projects } from '../data/portfolio';
import { useLanguage } from '../context/LanguageContext';

const Projects = () => {
  const { isChinese } = useLanguage();
  return (
    <div className="min-h-screen bg-grid">
      <section className="section">
        <div className="page-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="PROJECTS">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="eyebrow">{isChinese ? '项目索引' : 'Project index'}</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">{isChinese ? '把研究想法做到可以检验。' : 'Research ideas, built far enough to test.'}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                {isChinese
                  ? '这里收录我近期在模型评测、智能体行为、图推理、多模态系统、几何学习和创意编程方面的部分工作。'
                  : 'A curated set of current work across evaluation, agent behavior, graph reasoning, multimodal systems, geometric learning, and creative code.'}
              </p>
            </div>
            <div className="font-mono rounded-full border border-[var(--line)] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted)]">
              {isChinese ? `${projects.length} 个精选项目 · 2026 年 9 月` : `${projects.length} selected projects · Sep 2026`}
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Projects;
