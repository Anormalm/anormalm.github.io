import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion } from 'framer-motion';
import { FiArrowLeft, FiArrowRight, FiDownload, FiExternalLink, FiX } from 'react-icons/fi';
import { publications } from '../data/portfolio';
import { useLanguage } from '../context/LanguageContext';

const EXPERIENCE = [
  {
    role: 'Machine Learning Engineer Intern',
    roleZh: '机器学习工程实习生',
    place: 'TikTok · BRIC',
  },
  {
    role: 'Research Assistant',
    roleZh: '研究助理',
    place: 'National University of Singapore · DistDNA',
    placeZh: '新加坡国立大学 · DistDNA',
  },
  {
    role: 'Digital Developer Intern',
    roleZh: '数字开发实习生',
    place: 'MAHLE Thermal Systems',
    placeZh: '马勒热管理系统',
  },
];

const RESEARCH = [
  'Graph-grounded language models',
  'Graph learning and generalization',
  'Adaptive graph evidence',
  'On-device multimodal systems',
];

const RESEARCH_ZH = ['图基础语言模型', '图学习与泛化', '自适应图证据', '端侧多模态系统'];

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

const SKILLS_ZH = ['Python', 'C/C++', 'PyTorch', '图机器学习', '多模态 AI', '分布式系统', '边缘 AI', 'Docker'];

const GATE_CHOICES = [
  { label: 'Yes', labelZh: '是', message: 'Employer detected. Preparing the useful version.', messageZh: '检测到雇主信号，正在准备实用版本。' },
  { label: 'Not yet', labelZh: '还不是', message: 'Future employer energy detected. Access granted.', messageZh: '检测到未来雇主能量，允许访问。' },
  { label: 'Just curious', labelZh: '只是好奇', message: 'Curiosity is a valid credential. Access granted.', messageZh: '好奇心也是有效凭证，允许访问。' },
];

const CV_PHOTOS = [
  {
    src: '/lifan-signal.webp',
    alt: 'Lifan Hu standing in a garden at Sentosa, Singapore',
    altZh: '胡立凡站在新加坡圣淘沙的一处花园中',
    location: 'Sentosa, Singapore',
    locationZh: '新加坡 · 圣淘沙',
    date: 'September 2026',
    dateZh: '2026 年 9 月',
  },
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
  const { isChinese } = useLanguage();
  const [showGate, setShowGate] = useState(false);
  const [gateMessage, setGateMessage] = useState('');
  const [activePhoto, setActivePhoto] = useState(0);
  const photoDragStart = useRef(null);

  const changePhoto = (direction) => {
    setActivePhoto((current) => (current + direction + CV_PHOTOS.length) % CV_PHOTOS.length);
  };

  const photo = CV_PHOTOS[activePhoto];

  const onPhotoPointerDown = (event) => {
    if (CV_PHOTOS.length < 2) return;
    photoDragStart.current = event.clientX;
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPhotoPointerUp = (event) => {
    if (photoDragStart.current === null) return;
    const distance = event.clientX - photoDragStart.current;
    photoDragStart.current = null;
    if (Math.abs(distance) > 45) changePhoto(distance > 0 ? -1 : 1);
  };

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
              <div className="eyebrow">{isChinese ? '个人履历' : 'Curriculum vitae'}</div>
              <h1 className="font-display mt-3 text-4xl md:text-5xl">{isChinese ? '胡立凡' : 'Hu Lifan'}</h1>
              <p className="mt-4 max-w-3xl text-sm leading-6 text-[var(--muted)] md:text-base">
                {isChinese ? '新加坡国立大学计算机工程专业，专注机器学习研究与系统。' : 'Computer Engineering at NUS. Working across machine learning research and systems.'}
              </p>
            </div>
            <div className="cv-hero-actions">
              <button type="button" onClick={() => setShowGate(true)} className="button-primary">
                {isChinese ? '下载完整履历' : 'Download'} <FiDownload />
              </button>
            </div>
          </div>

          <figure className="cv-photo-album">
            <div
              className="cv-profile-photo"
              role="region"
              tabIndex="0"
              aria-label={isChinese ? '履历照片档案' : 'CV photo archive'}
              data-cursor="swipe"
              onPointerDown={onPhotoPointerDown}
              onPointerUp={onPhotoPointerUp}
              onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') changePhoto(-1);
                if (event.key === 'ArrowRight') changePhoto(1);
              }}
            >
              <AnimatePresence initial={false} mode="wait">
                <Motion.img
                  key={photo.src}
                  src={photo.src}
                  alt={isChinese ? photo.altZh : photo.alt}
                  width="1600"
                  height="1200"
                  decoding="async"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                />
              </AnimatePresence>
              <span className="cv-photo-label">{isChinese ? '现场记录' : 'Field notes'}</span>
              <div className="cv-photo-controls" aria-label={isChinese ? '照片档案控制项' : 'Photo archive controls'}>
                <button
                  type="button"
                  onClick={() => changePhoto(-1)}
                  disabled={CV_PHOTOS.length === 1}
                  aria-label={isChinese ? '上一张照片' : 'Previous photo'}
                >
                  <FiArrowLeft />
                </button>
                <button
                  type="button"
                  onClick={() => changePhoto(1)}
                  disabled={CV_PHOTOS.length === 1}
                  aria-label={isChinese ? '下一张照片' : 'Next photo'}
                >
                  <FiArrowRight />
                </button>
              </div>
            </div>
            <figcaption className="cv-photo-caption">
              <span>{isChinese ? photo.locationZh : photo.location}</span>
              <span className="cv-photo-dots" aria-label={isChinese ? '照片索引' : 'Photo index'}>
                {CV_PHOTOS.map((item, index) => (
                  <button
                    key={item.src}
                    type="button"
                    className={index === activePhoto ? 'is-active' : ''}
                    onClick={() => setActivePhoto(index)}
                    aria-label={isChinese ? `查看照片 ${index + 1}` : `View photo ${index + 1}`}
                    aria-current={index === activePhoto ? 'true' : undefined}
                  />
                ))}
              </span>
              <span>{isChinese ? photo.dateZh : photo.date} · {isChinese ? '档案' : 'LOG'} {String(activePhoto + 1).padStart(2, '0')} / {String(CV_PHOTOS.length).padStart(2, '0')}</span>
            </figcaption>
          </figure>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">{isChinese ? '经历' : 'Experience'}</div>
            <div className="mt-6 space-y-4">
              {EXPERIENCE.map((item) => (
                <article key={`${item.role}-${item.place}`} className="border-l border-[var(--line)] py-1 pl-5">
                  <h2 className="font-display text-xl">{isChinese ? item.roleZh : item.role}</h2>
                  <div className="font-mono mt-1 text-[11px] uppercase tracking-[0.16em] text-[var(--accent)]">
                    {isChinese ? (item.placeZh || item.place) : item.place}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">{isChinese ? '教育' : 'Education'}</div>
              <h2 className="font-display mt-4 text-xl">{isChinese ? '新加坡国立大学' : 'National University of Singapore'}</h2>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                {isChinese ? <>计算机工程学士<br />创新与设计第二专业 · 数学辅修</> : <>B.Eng. in Computer Engineering<br />Second Major in Innovation &amp; Design · Minor in Mathematics</>}
              </p>
              <div className="mt-5 border-t border-[var(--line)] pt-5">
                <h3 className="font-display text-lg">{isChinese ? '上海交通大学' : 'Shanghai Jiao Tong University'}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  {isChinese ? '暑期学校 · 代数与统计推断' : 'Summer School · Algebra and Statistical Inference'}
                </p>
              </div>
            </section>

            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">{isChinese ? '部分荣誉' : 'Selected recognition'}</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>{isChinese ? 'CDE 创新与研究奖 · 优异奖' : 'CDE Innovation & Research Award · Merit Award'}</li>
                <li>{isChinese ? '美国大学生数学建模竞赛 · 荣誉奖' : 'Mathematical Contest in Modeling · Honorable Mention'}</li>
                <li>{isChinese ? '美国大学生数学建模竞赛 · 特等奖提名' : 'Mathematical Contest in Modeling · Meritorious Winner'}</li>
                <li>{isChinese ? 'WorldQuant BRAIN 挑战赛 · 银牌' : 'WorldQuant BRAIN Challenge · Silver Medal'}</li>
              </ul>
            </section>
          </div>

          <section className="tech-panel rounded-3xl p-6 md:p-7 lg:col-span-2">
            <div className="eyebrow">{isChinese ? '研究方向' : 'Selected research'}</div>
            <ul className="mt-5 grid gap-3 md:grid-cols-2">
              {(isChinese ? RESEARCH_ZH : RESEARCH).map((topic) => (
                <li key={topic} className="rounded-2xl border border-[var(--line)] bg-[var(--paper)]/70 p-5 font-display text-lg">
                  {topic}
                </li>
              ))}
            </ul>
          </section>

          <section className="tech-panel rounded-3xl p-6 md:p-7">
            <div className="eyebrow">{isChinese ? '论文' : 'Publications'}</div>
            <div className="mt-5 space-y-5">
              {publications.map((publication) => (
                <Publication key={publication.title} publication={publication} />
              ))}
            </div>
          </section>

          <div className="grid gap-6">
            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">{isChinese ? '学术服务' : 'Academic service'}</div>
              <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--muted)]">
                <li>{isChinese ? '受邀审稿人 · EMNLP 2026 GroundLM 工作坊' : 'Invited Reviewer · EMNLP 2026 Workshop GroundLM'}</li>
                <li>{isChinese ? '受邀审稿人 · NeurIPS 2026 VLM4RWD 工作坊' : 'Invited Reviewer · NeurIPS 2026 Workshop VLM4RWD'}</li>
              </ul>
            </section>

            <section className="tech-panel rounded-3xl p-6 md:p-7">
              <div className="eyebrow">{isChinese ? '核心工具' : 'Core toolkit'}</div>
              <div className="mt-5 flex flex-wrap gap-2">
                {(isChinese ? SKILLS_ZH : SKILLS).map((skill) => (
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
              <div className="eyebrow">{isChinese ? '真人验证 / 非常认真' : 'Human verification / totally serious'}</div>
              <h2 id="cv-gate-title">{isChinese ? '你是雇主吗？' : 'Are you an employer?'}</h2>
              {gateMessage ? (
                <Motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="gate-result">
                  <span className="live-dot" /> {gateMessage}
                </Motion.div>
              ) : (
                <div className="gate-options">
                  {GATE_CHOICES.map((choice, index) => (
                    <button key={choice.label} type="button" onClick={() => onGateChoice(isChinese ? choice.messageZh : choice.message)}>
                      <span>0{index + 1}</span>{isChinese ? choice.labelZh : choice.label}
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
