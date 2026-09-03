import { FiDownload, FiExternalLink } from 'react-icons/fi';
import { publications } from '../data/portfolio';

const EXPERIENCE = [
  {
    role: 'Machine Learning Engineer Intern',
    place: 'TikTok Pte. Ltd. · BRIC · Singapore',
    period: 'May 2026–Present',
    detail:
      'Developing graph-based integrity-risk discovery methods and distributed Spark pipelines for large-scale live-streaming ecosystems.',
  },
  {
    role: 'Research Assistant · DistDNA',
    place: 'National University of Singapore',
    period: 'Aug 2026–Present',
    detail: 'Research assistantship under Dr Wu Zhaomin and Prof He Bingsheng.',
  },
  {
    role: 'Digital Developer Intern',
    place: 'Shanghai MAHLE Thermal Systems',
    period: 'May–Jul 2025',
    detail:
      'Built offline multilingual transcription, document vision and OCR pipelines, factory telemetry tools, and lightweight inference APIs.',
  },
];

const RESEARCH = [
  {
    title: 'Graph Evidence Is Not Text Evidence',
    period: 'Jun 2026–Present',
    detail:
      'Evaluating graph-grounded language models through serialization-order sensitivity, isomorphism consistency, semantic interference, and distractor robustness.',
  },
  {
    title: 'Graph Grokking and Phantom Transitions',
    period: 'May 2026–Present',
    detail:
      'Studying delayed generalization, memorization basins, representation geometry, and abrupt performance transitions in graph neural networks and graph transformers.',
  },
  {
    title: 'Adaptive Graph Evidence Acquisition',
    period: 'May–Aug 2026',
    detail:
      'Developed a budget-constrained framework for selecting graph evidence before classification and LLM-based fraud reasoning.',
  },
  {
    title: 'On-Device Vision-Language Assistant',
    period: 'Aug 2025–Feb 2026',
    detail:
      'Designed and benchmarked quantized multimodal models on Jetson Orin Nano Super for offline assistive vision; recognized with a Merit Award.',
  },
];

const SKILLS = [
  'Python',
  'C/C++',
  'Java',
  'JavaScript',
  'SQL',
  'PySpark',
  'Haskell',
  'PyTorch',
  'PyTorch Geometric',
  'Graph Transformers',
  'Reinforcement Learning',
  'Vision-Language Models',
  'OpenCV',
  'TensorRT',
  'FastAPI',
  'Docker',
  'Neo4j',
  'ROS2',
];

const Publication = ({ publication }) => {
  const content = (
    <>
      <h2 className="font-display text-lg transition group-hover:text-[var(--accent)]">
        {publication.title}
      </h2>
      <div className="font-mono mt-1 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--muted)]">
        {publication.venue} {publication.link && <FiExternalLink />}
      </div>
    </>
  );

  if (!publication.link) return <article>{content}</article>;

  return (
    <a href={publication.link} target="_blank" rel="noopener noreferrer" className="group block">
      {content}
    </a>
  );
};

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
                Computer Engineering student at NUS, Machine Learning Engineer Intern at TikTok BRIC, and Research
                Assistant working on graph machine learning, graph-grounded language models, edge AI, and
                production-scale systems.
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
              <a href="/CV-Lifan-Latest.pdf" download="Hu-Lifan-CV.pdf" className="button-primary">
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
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="font-display text-xl">{item.role}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--muted)]">
                      {item.period}
                    </span>
                  </div>
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
                B.Eng. in Computer Engineering<br />
                Second Major in Innovation & Design · Minor in Mathematics<br />
                GPA 4.6 · 2024–Present
              </p>
              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-lg">Shanghai Jiao Tong University</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Summer School · Algebra and Statistical Inference · 2025
                </p>
              </div>
            </section>

            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">Selected recognition</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>CDE Innovation & Research Award · Merit Award · 2026</li>
                <li>Mathematical Contest in Modeling · Honorable Mention · 2026</li>
                <li>Mathematical Contest in Modeling · Meritorious Winner · 2025</li>
                <li>WorldQuant BRAIN Challenge · Silver Medal · 2025</li>
              </ul>
            </section>
          </div>

          <section className="tech-panel rounded-3xl p-6 md:p-7 lg:col-span-2">
            <div className="eyebrow">Selected research</div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {RESEARCH.map((item) => (
                <article key={item.title} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h2 className="font-display text-lg">{item.title}</h2>
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--accent)]">
                      {item.period}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{item.detail}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">Publications</div>
            <div className="mt-5 space-y-5">
              {publications.map((publication) => (
                <Publication key={publication.title} publication={publication} />
              ))}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">Academic service</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>Invited Reviewer · GroundLM Workshop at EMNLP 2026</li>
                <li>Invited Reviewer · VLM4RWD Workshop at NeurIPS 2026</li>
              </ul>
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
        </div>
      </section>
    </div>
  );
};

export default CV;
