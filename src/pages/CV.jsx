import { useEffect, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiDownload, FiExternalLink, FiX } from 'react-icons/fi';
import { publications } from '../data/portfolio';

const EXPERIENCE = [
  {
    role: 'Machine Learning Engineer Intern',
    place: 'TikTok · BRIC',
  },
  {
    role: 'Research Assistant',
    place: 'National University of Singapore · DistDNA',
  },
  {
    role: 'Digital Developer Intern',
    place: 'MAHLE Thermal Systems',
  },
];

const RESEARCH = [
  'Graph-grounded language models',
  'Graph learning and generalization',
  'Adaptive graph evidence',
  'On-device multimodal systems',
];

const SKILLS = [
  'Python',
  'C/C++',
  'PyTorch',
  'Graph ML',
  'Multimodal AI',
  'Distributed Systems',
  'Edge AI',
  'Docker',
];

const GATE_CHOICES = [
  ['Yes', 'Employer detected. Preparing the useful version.'],
  ['Not yet', 'Future employer energy detected. Access granted.'],
  ['Just curious', 'Curiosity is a valid credential. Access granted.'],
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
  const [showGate, setShowGate] = useState(false);
  const [gateMessage, setGateMessage] = useState('');

  useEffect(() => {
    if (!showGate) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setShowGate(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [showGate]);

  const triggerDownload = () => {
    const link = document.createElement('a');
    link.href = '/CV-Lifan-Latest.pdf';
    link.download = 'Hu-Lifan-CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const onGateChoice = (message) => {
    setGateMessage(message);
    window.setTimeout(triggerDownload, 360);
    window.setTimeout(() => {
      setShowGate(false);
      setGateMessage('');
    }, 1450);
  };

  return (
    <div className="min-h-screen bg-grid">
      <section className="section">
        <div className="page-hero-panel cv-hero-panel tech-panel rounded-3xl p-7 md:p-9" data-page="CV">
          <div className="cv-hero-copy">
            <div>
              <div className="eyebrow">Curriculum vitae</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">Hu Lifan</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                Computer Engineering at NUS. Working across machine learning research and systems.
              </p>
            </div>
            <div className="cv-hero-actions">
              <button type="button" onClick={() => setShowGate(true)} className="button-primary">
                Download <FiDownload />
              </button>
            </div>
          </div>

          <figure className="cv-profile-photo">
            <img
              src="/lifan-signal.webp"
              alt="Lifan Hu standing in a garden"
              width="1600"
              height="1200"
              decoding="async"
            />
            <figcaption>
              <span>Profile / 2026</span>
              <span>Singapore</span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">Experience</div>
            <div className="mt-6 space-y-4">
              {EXPERIENCE.map((item) => (
                <article key={`${item.role}-${item.place}`} className="border-l border-[var(--line)] py-1 pl-5">
                  <h2 className="font-display text-xl">{item.role}</h2>
                  <div className="font-mono mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {item.place}
                  </div>
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
                Second Major in Innovation & Design · Minor in Mathematics
              </p>
              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-lg">Shanghai Jiao Tong University</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Summer School · Algebra and Statistical Inference
                </p>
              </div>
            </section>

            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">Selected recognition</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>CDE Innovation & Research Award · Merit Award</li>
                <li>Mathematical Contest in Modeling · Honorable Mention</li>
                <li>Mathematical Contest in Modeling · Meritorious Winner</li>
                <li>WorldQuant BRAIN Challenge · Silver Medal</li>
              </ul>
            </section>
          </div>

          <section className="tech-panel rounded-3xl p-6 md:p-7 lg:col-span-2">
            <div className="eyebrow">Selected research</div>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {RESEARCH.map((topic) => (
                <li key={topic} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5 font-display text-lg">
                  {topic}
                </li>
              ))}
            </ul>
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
                <li>Invited Reviewer · GroundLM Workshop</li>
                <li>Invited Reviewer · VLM4RWD Workshop</li>
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

      <AnimatePresence>
        {showGate && (
          <Motion.div
            className="gate-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setShowGate(false);
            }}
          >
            <Motion.section
              role="dialog"
              aria-modal="true"
              aria-labelledby="cv-gate-title"
              initial={{ opacity: 0, scale: 0.86, rotate: -3, y: 30 }}
              animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, rotate: 2, y: 20 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="gate-card"
            >
              <button type="button" onClick={() => setShowGate(false)} className="gate-close" aria-label="Close">
                <FiX />
              </button>
              <div className="gate-orbit" aria-hidden="true"><i /><i /><i /></div>
              <div className="eyebrow">Human verification / totally serious</div>
              <h2 id="cv-gate-title">Are you an employer?</h2>
              {gateMessage ? (
                <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="gate-result">
                  <span className="live-dot" /> {gateMessage}
                </Motion.div>
              ) : (
                <div className="gate-options">
                  {GATE_CHOICES.map(([label, message], index) => (
                    <button key={label} type="button" onClick={() => onGateChoice(message)}>
                      <span>0{index + 1}</span>{label}
                    </button>
                  ))}
                </div>
              )}
            </Motion.section>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CV;
