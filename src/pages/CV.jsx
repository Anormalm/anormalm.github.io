import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { publications } from '../data/portfolio';

const EXPERIENCE = [
  {
    role: 'Research Assistant',
    place: 'National University of Singapore',
    detail: 'Research on LLM fusion, model behavior, evaluation, and systems that combine evidence across models.',
  },
  {
    role: 'Machine Learning Engineering Intern',
    place: 'TikTok',
    detail: 'Former intern working at the boundary between machine learning research and production engineering.',
  },
  {
    role: 'Undergraduate Researcher',
    place: 'National University of Singapore',
    detail: 'Built and benchmarked quantized on-device vision-language assistants on Jetson Orin Nano Super.',
  },
  {
    role: 'Digital Developer Intern',
    place: 'Shanghai MAHLE Thermal Systems',
    detail: 'Developed OCR, multilingual transcription, predictive maintenance, and internal inference tooling.',
  },
];

const SKILLS = [
  'Python',
  'C/C++',
  'JavaScript',
  'PyTorch',
  'Transformers',
  'Graph learning',
  'Reinforcement learning',
  'LLM evaluation',
  'ROS2',
  'OpenCV',
  'React',
  'FastAPI',
];

const CV = () => {
  return (
    <div className="min-h-screen bg-grid">
      <section className="section">
        <div className="tech-panel rounded-3xl p-7 md:p-9">
          <div className="flex flex-wrap items-end justify-between gap-7">
            <div>
              <div className="eyebrow">Curriculum vitae</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">Hu Lifan</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                Computer Engineering student and Research Assistant at NUS, focused on machine learning systems,
                agentic AI, evaluation, graph reasoning, and multimodal computing.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="/CV-Lifan-Latest.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="button-secondary"
              >
                Open PDF <FiExternalLink />
              </a>
              <a href="/CV-Lifan-Latest.pdf" download className="button-primary">
                Download <FiDownload />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">Experience</div>
            <div className="mt-6 space-y-6">
              {EXPERIENCE.map((item) => (
                <article key={`${item.role}-${item.place}`} className="border-l border-[var(--line)] pl-5">
                  <h2 className="font-display text-xl">{item.role}</h2>
                  <div className="font-mono mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {item.place}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">Education</div>
              <h2 className="font-display mt-4 text-xl">National University of Singapore</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                B.Eng. in Computer Engineering, IoT specialization<br />
                Second Major in Innovation & Design · Minor in Mathematics<br />
                2024–present
              </p>
              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-lg">Shanghai Jiao Tong University</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">Summer School · Algebra and Statistical Inference · 2025</p>
              </div>
            </section>

            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">Selected recognition</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>WorldQuant BRAIN Challenge · Silver Medal · 2025</li>
                <li>Mathematical Contest in Modeling · Meritorious Winner · 2025</li>
              </ul>
            </section>
          </div>

          <section className="tech-panel rounded-3xl p-6 md:p-7 lg:col-span-2">
            <div className="eyebrow">Research direction</div>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {[
                ['Language-model evaluation', 'Human preference, direct usability, semantic preservation, and behavior under correction.'],
                ['Adaptive reasoning', 'Graph evidence acquisition, multi-agent systems, and cost-aware inference.'],
                ['Embodied intelligence', 'On-device multimodal models, pose understanding, robotics, and privacy-first perception.'],
              ].map(([title, detail]) => (
                <div key={title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5">
                  <h2 className="font-display text-lg">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">Publications</div>
            <div className="mt-5 space-y-5">
              {publications.map((publication) => (
                <a
                  key={publication.title}
                  href={publication.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block"
                >
                  <h2 className="font-display text-lg transition group-hover:text-[var(--accent)]">
                    {publication.title}
                  </h2>
                  <div className="font-mono mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
                    {publication.venue} <FiExternalLink />
                  </div>
                </a>
              ))}
            </div>
          </section>

          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">Core toolkit</div>
            <div className="mt-5 flex flex-wrap gap-2">
              {SKILLS.map((skill) => (
                <span key={skill} className="tag tag-large">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        </div>
      </section>
    </div>
  );
};

export default CV;
