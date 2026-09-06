import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion as Motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaMedium } from 'react-icons/fa';
import { FiArrowDown, FiArrowUpRight, FiFileText, FiMail, FiMapPin } from 'react-icons/fi';
import { Cursor, useTypewriter } from 'react-simple-typewriter';
import Marquee from '../components/Marquee';
import ProjectCard from '../components/ProjectCard';
import GeoSignal from '../components/GeoSignal';
import { projects } from '../data/portfolio';
import { useLanguage } from '../context/LanguageContext';

const FEATURED_PROJECTS = projects.filter((project) => project.featured);

const PRINCIPLES = [
  {
    verb: 'Make',
    verbZh: '构建',
    title: 'Build the whole loop',
    titleZh: '把整个闭环做出来',
    detail: 'Research gets interesting when the model, interface, and measurement path all work together.',
    detailZh: '当模型、界面与测量路径真正协同工作时，研究才开始变得有意思。',
  },
  {
    verb: 'Test',
    verbZh: '验证',
    title: 'Claims need evidence',
    titleZh: '主张需要证据',
    detail: 'I care about reproducible evaluation, honest boundaries, and finding out why a system works.',
    detailZh: '我重视可复现的评测、诚实的边界，以及弄清系统为什么有效。',
  },
  {
    verb: 'Wander',
    verbZh: '漫游',
    title: 'Keep strange ideas alive',
    titleZh: '给奇怪的想法留条活路',
    detail: 'The useful route is not always the obvious one. I leave room for puzzles, experiments, and detours.',
    detailZh: '有用的路线不总是最显眼的那条。我会给谜题、实验和绕路留出空间。',
  },
];

const SOCIALS = [
  ['GitHub', 'https://github.com/Anormalm', <FaGithub key="github" />],
  ['LinkedIn', 'https://www.linkedin.com/in/anormalm/', <FaLinkedin key="linkedin" />],
  ['Medium', 'https://medium.com/@hulifan55555', <FaMedium key="medium" />],
];

const INTRO_FACTS = [
  'I’m a Computer Engineering student at NUS in Singapore.',
  'My academic detours include a second major in Innovation & Design and a minor in Mathematics.',
  'Right now, I’m a Machine Learning Engineer Intern with TikTok’s BRIC team and a Research Assistant at NUS.',
  'I spend most of my research time around graph intelligence, grounded language models, edge AI, and distributed systems.',
  'One question I keep returning to is whether a model understands an actual graph—or merely the order in which someone wrote it down.',
  'I’ve also benchmarked quantized vision-language models on a Jetson Orin Nano Super: tiny hardware with surprisingly big opinions.',
  'My projects wander from DeFi detection and persistent memory systems to a natural-language programming language called Linguine.',
  'I like turning abstract ideas into things you can poke: simulations, evaluation harnesses, strange interfaces, and occasionally a hidden route.',
  'That last part is why this site has ghost channels, a chaos key, and more diagnostics than a portfolio strictly needs.',
  'Outside the technical signal, I write about mathematics, AI, systems, and whatever sits uncomfortably between them.',
  'I reached Master II in GeoGuessr across multiple seasons; road markings and utility poles have become a suspiciously useful hobby.',
  'The current soundtrack is Maurice Ravel’s Gaspard de la Nuit.',
  'My working rule is simple: follow curiosity, test the claim, and keep a little weirdness in the result.',
  'Or, in fewer words: I build and code whenever I want to.',
];

const INTRO_FACTS_ZH = [
  '我是新加坡国立大学计算机工程专业的学生。',
  '同时修读创新与设计第二专业，以及数学辅修。',
  '目前在 TikTok BRIC 团队担任机器学习工程实习生，并在新加坡国立大学担任研究助理。',
  '我的研究主要围绕图智能、具备图基础的语言模型、边缘 AI 和分布式系统。',
  '我经常追问：模型真的理解了一张图，还是只记住了它被写下来的顺序？',
  '我也在 Jetson Orin Nano Super 上评测过量化视觉语言模型——硬件很小，脾气不小。',
  '我的项目从 DeFi 欺诈检测、持久记忆系统，一路走到名为 Linguine 的自然语言编程语言。',
  '我喜欢把抽象想法变成可以亲手摆弄的东西：模拟器、评测工具、奇怪界面，偶尔还有隐藏路线。',
  '所以这个网站里有幽灵频道、混沌按钮，以及比普通作品集更像诊断台的东西。',
  '技术之外，我会写数学、AI、系统，以及那些不太愿意被归类的交界问题。',
  '我曾连续多个赛季达到 GeoGuessr Master II；道路标线和电线杆也因此成了可疑的爱好。',
  '最近的工作配乐是拉威尔的《夜之幽灵》。',
  '我的工作准则很简单：跟随好奇心，验证主张，并让结果保留一点怪。',
  '再短一点：想做就做，想写就写。',
];

const Home = () => {
  const { isChinese } = useLanguage();
  const heroRef = useRef(null);
  const [ghostMode, setGhostMode] = useState(false);
  const [knowledgeLevel, setKnowledgeLevel] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const orbitY = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const orbitRotate = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const revealedFactCount = Math.round((knowledgeLevel / 100) * INTRO_FACTS.length);
  const introFacts = isChinese ? INTRO_FACTS_ZH : INTRO_FACTS;

  const [typedText] = useTypewriter({
    words: isChinese
      ? ['图基础语言模型', '自适应图证据', '边缘多模态推理', '分布式机器学习系统']
      : ['graph-grounded language models', 'adaptive graph evidence', 'edge multimodal inference', 'distributed ML systems'],
    loop: 0,
    typeSpeed: 52,
    deleteSpeed: 28,
    delaySpeed: 1450,
  });
  const [ghostTypedText] = useTypewriter({
    words: isChinese
      ? ['追踪分布式记忆中的隐藏路线', '从数字废墟中恢复信号', '把运行时碎片拼成完整系统', '在噪声底里监听状态变化']
      : ['tracing hidden routes in distributed memory', 'recovering signals from digital ruins', 'stitching runtime fragments into coherent systems', 'listening for state changes in the noise floor'],
    loop: 0,
    typeSpeed: 40,
    deleteSpeed: 25,
    delaySpeed: 1250,
  });

  useEffect(() => {
    if (!ghostMode) return undefined;
    const timer = window.setTimeout(() => setGhostMode(false), 20_000);
    return () => window.clearTimeout(timer);
  }, [ghostMode]);

  const toggleGhostMode = () => setGhostMode((previous) => !previous);

  return (
    <div className="home-page">
      <section ref={heroRef} className={`kinetic-hero ${ghostMode ? 'ghost-mode' : ''}`}>
        <div className="hero-coordinate hero-coordinate-right" aria-hidden="true">{isChinese ? '向下滚动探索' : 'SCROLL TO EXPLORE'}</div>

        <Motion.div className="hero-copy" style={reduceMotion ? undefined : { y: copyY }}>
          <h1 className={`kinetic-title ${isChinese ? 'is-chinese' : ''}`} aria-label={isChinese ? '我构建会思考、会行动的系统' : 'I build systems that think and move'}>
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.08, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            >
              {isChinese ? '我构建' : 'I build'}
            </Motion.span>
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.16, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="kinetic-title-offset"
            >
              {isChinese ? '会思考' : 'systems that'}
            </Motion.span>
            <Motion.span
              initial={{ y: '115%' }}
              animate={{ y: 0 }}
              transition={{ delay: 0.24, duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="kinetic-title-accent"
            >
              {isChinese ? '会行动的系统。' : <>think <i>&amp;</i> move.</>}
            </Motion.span>
          </h1>

          <div className="hero-bottom-grid">
            <div className="intro-console">
              <p className="intro-copy" aria-live="polite">
                <strong>{isChinese ? '我是胡立凡。' : 'I’m Lifan Hu.'}</strong>
                <span className="intro-baseline"> {isChinese ? '我做东西、验证想法，也跟着好奇心走。' : 'I build things, test ideas, and follow curiosity.'}</span>
                <AnimatePresence initial={false}>
                  {introFacts.slice(0, revealedFactCount).map((fact, index) => (
                    <Motion.span
                      key={fact}
                      initial={{ opacity: 0, filter: 'blur(5px)' }}
                      animate={{ opacity: 1, filter: 'blur(0px)' }}
                      exit={{ opacity: 0, filter: 'blur(4px)' }}
                      transition={{ duration: reduceMotion ? 0.01 : 0.24, delay: reduceMotion ? 0 : index * 0.008 }}
                      className="intro-fact"
                    >
                      {' '}{fact}
                    </Motion.span>
                  ))}
                </AnimatePresence>
              </p>
              <div className="intro-slider-row">
                <span>{isChinese ? '不吹' : 'No larp'}</span>
                <div className="intro-slider-track">
                  <span className="intro-slider-progress" style={{ width: `${knowledgeLevel}%` }} aria-hidden="true" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={knowledgeLevel}
                    onChange={(event) => setKnowledgeLevel(Number(event.target.value))}
                    aria-label={isChinese ? '显示更多关于立凡的信息' : 'Reveal more facts about Lifan'}
                    aria-valuetext={isChinese ? `已显示 ${revealedFactCount} / ${INTRO_FACTS.length}` : `${revealedFactCount} of ${INTRO_FACTS.length} facts visible`}
                  />
                </div>
                <span>{isChinese ? '拉满' : 'Max larp'}</span>
              </div>
            </div>

            <div className="hero-signal-panel">
              <button
                type="button"
                onDoubleClick={toggleGhostMode}
                onClick={(event) => {
                  if (event.detail === 0) toggleGhostMode();
                }}
                aria-pressed={ghostMode}
                className="signal-line"
                title={isChinese ? '双击解锁幽灵输入' : 'Double-click to unlock ghost typing'}
              >
                <span>{ghostMode ? (isChinese ? '幽灵频道' : 'Ghost channel') : (isChinese ? '当前信号' : 'Current signal')}</span>
                <strong>{ghostMode ? ghostTypedText : typedText}</strong>
                <Cursor cursorStyle="_" cursorColor="var(--accent-warm)" />
              </button>
              <div className="hero-actions">
                <Link to="/projects" className="button-primary">
                  {isChinese ? '浏览项目' : 'Explore work'} <FiArrowUpRight />
                </Link>
                <Link to="/cv" className="button-secondary">
                  {isChinese ? '查看履历' : 'View CV'} <FiFileText />
                </Link>
                <Link to="/lab" className="hero-lab-link">
                  {isChinese ? '进入实验室' : 'Enter the lab'} <FiArrowUpRight />
                </Link>
              </div>
            </div>
          </div>
        </Motion.div>

        <Motion.aside
          className="signal-world"
          style={reduceMotion ? undefined : { y: orbitY, rotate: orbitRotate }}
          initial={{ opacity: 0, scale: 0.75 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.32, duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
          aria-label={isChinese ? '交互式信号图' : 'Interactive signal map'}
        >
          <span className="signal-ring signal-ring-a"><i /></span>
          <span className="signal-ring signal-ring-b"><i /></span>
          <span className="signal-ring signal-ring-c"><i /></span>
          <button type="button" className="signal-core" onClick={toggleGhostMode} aria-label={isChinese ? '切换幽灵信号' : 'Toggle ghost signal'}>
            <span>LH</span>
            <small>{ghostMode ? (isChinese ? '幽灵' : 'GHOST') : (isChinese ? '在线' : 'ONLINE')}</small>
          </button>
          <span className="signal-label signal-label-a">{isChinese ? '图' : 'GRAPH'}</span>
          <span className="signal-label signal-label-b">{isChinese ? '语言' : 'LANGUAGE'}</span>
          <span className="signal-label signal-label-c">{isChinese ? '系统' : 'SYSTEMS'}</span>
        </Motion.aside>

        <a href="#selected-work" className="scroll-cue" aria-label={isChinese ? '滚动到精选项目' : 'Scroll to selected work'}>
          <span>{isChinese ? '向下' : 'Down'}</span><FiArrowDown />
        </a>
      </section>

      <Marquee />

      <section id="selected-work" className="section editorial-section">
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="editorial-heading"
        >
          <div className="eyebrow">{isChinese ? '精选信号 / 2026' : 'Selected signals / 2026'}</div>
          <h2 className="display-heading">{isChinese ? <>让想法<br /><em>可以验证。</em></> : <>Ideas made<br /><em>testable.</em></>}</h2>
          <div className="editorial-aside">
            <p>{isChinese ? '研究、实验与真正运行的系统——把它们做到足以暴露事实。' : 'Research, experiments, and working systems—built far enough to expose what is actually true.'}</p>
            <Link to="/projects" className="link-arrow">{isChinese ? '查看完整索引' : 'See the full index'} <FiArrowUpRight /></Link>
          </div>
        </Motion.div>

        <div className="featured-grid">
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>
      </section>

      <GeoSignal />

      <section className="manifesto-section">
        <div className="section manifesto-inner">
          <div className="eyebrow">{isChinese ? '个人操作系统' : 'Personal operating system'}</div>
          <Motion.h2
            initial={{ opacity: 0, y: 36 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="manifesto-quote"
          >
            {isChinese ? <>“想做就做，<br />想写就写。”</> : <>“I build and code<br />whenever I want to.”</>}
          </Motion.h2>

          <div className="principle-list">
            {PRINCIPLES.map((principle, index) => (
              <Motion.article
                key={principle.title}
                initial={{ opacity: 0, x: index % 2 ? 30 : -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="principle-row"
              >
                <span className="principle-index">0{index + 1}</span>
                  <strong>{isChinese ? principle.verbZh : principle.verb}</strong>
                  <div>
                  <h3>{isChinese ? principle.titleZh : principle.title}</h3>
                  <p>{isChinese ? principle.detailZh : principle.detail}</p>
                </div>
              </Motion.article>
            ))}
          </div>

          <div className="now-playing">
            <span className="playing-bars" aria-hidden="true"><i /><i /><i /><i /></span>
            <span>{isChinese ? '非技术信号' : 'Non-tech signal'}</span>
            <strong>{isChinese ? '《夜之幽灵》· 莫里斯·拉威尔' : 'Gaspard de la Nuit · Maurice Ravel'}</strong>
          </div>
        </div>
      </section>

      <section className="section contact-stage">
        <div className="contact-stage-copy">
          <div className="eyebrow">{isChinese ? '开放频道' : 'Open channel'}</div>
          <h2>{isChinese ? <>一起做点<br /><span>奇怪的东西。</span></> : <>Let’s make<br /><span>something strange.</span></>}</h2>
          <p>{isChinese ? '研究想法、智能系统、有野心的原型——或一个怎么也放不进现成框架的问题。' : 'Research ideas, intelligent systems, ambitious prototypes—or a problem that refuses to fit neatly.'}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/contact" className="button-primary">{isChinese ? '开始交流' : 'Start a conversation'} <FiMail /></Link>
            <div className="location-pill"><FiMapPin /> {isChinese ? '新加坡' : 'Singapore'}</div>
          </div>
        </div>

        <div className="contact-orbit" aria-hidden="true">
          <span className="contact-orbit-text">OPEN TO COLLABORATION · OPEN TO IDEAS · </span>
          <span className="contact-orbit-core">+</span>
        </div>
      </section>

      <footer className="site-footer">
        <div className="site-footer-name">LIFAN<br />HU</div>
        <div className="site-footer-meta">
          <div>{isChinese ? '© 2026 · Anormalm 制作' : '© 2026 · Built by Anormalm'}</div>
          <div className="footer-socials">
            {SOCIALS.map(([label, href, icon]) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" aria-label={label}>{icon}</a>
            ))}
          </div>
          <a href="mailto:anormalm@outlook.com">anormalm@outlook.com <FiArrowUpRight /></a>
          <Link to="/privacy">{isChinese ? '隐私' : 'Privacy'} <FiArrowUpRight /></Link>
        </div>
      </footer>
    </div>
  );
};

export default Home;
