export const SITE_URL = 'https://anormalm.com';

// Shared by the client and the GitHub Pages build, so direct visits and
// client-side navigation publish the same identity and canonical URL.
export const PAGES = {
  '/': {
    title: 'Lifan Hu | ML Systems & Research', titleZh: '胡立凡｜机器学习系统与研究',
    heading: 'I build systems that think and move.',
    description: 'Lifan Hu is a Machine Learning Engineer Intern at TikTok and Research Assistant at NUS working on graph ML, language-model evaluation, multimodal inference, and production systems.',
  },
  '/projects': {
    title: 'Projects | Lifan Hu', titleZh: '项目｜胡立凡',
    heading: 'Systems, experiments, and applied research.',
    description: 'Explore Lifan Hu’s work in graph reasoning, model evaluation, agent behavior, memory systems, multimodal AI, and creative code.',
  },
  '/writings': {
    title: 'Writing | Lifan Hu', titleZh: '文章｜胡立凡',
    heading: 'Notes from the boundary of math and AI.',
    description: 'Essays by Lifan Hu on model architecture, production judgment, topology, and the connections between research and engineering.',
  },
  '/lab': {
    title: 'Interactive Lab | Lifan Hu', titleZh: '交互实验室｜胡立凡',
    heading: 'Interactive Lab',
    description: 'Explore mathematical systems, particle dynamics, vector fields, and estimation through interactive experiments by Lifan Hu.',
  },
  '/cv': {
    title: 'CV | Lifan Hu', titleZh: '履历｜胡立凡', heading: 'Hu Lifan',
    description: 'Research, publications, education, and engineering experience of Lifan Hu at NUS, TikTok, and MAHLE. The downloadable CV is being updated.',
  },
  '/contact': {
    title: 'Contact | Lifan Hu', titleZh: '联系｜胡立凡', heading: 'Let’s compare notes.',
    description: 'Contact Lifan Hu about model evaluation, intelligent systems, applied machine learning, or research collaboration.',
  },
  '/privacy': {
    title: 'Privacy | Lifan Hu', titleZh: '隐私｜胡立凡', heading: 'Small signal. No dossier.',
    description: 'How anormalm.com handles anonymous visitor counts, optional location features, language selection, and your privacy choices.',
  },
  '/node': {
    title: 'Node | Lifan Hu', titleZh: '隐藏节点｜胡立凡', heading: 'Hidden node',
    description: 'An intentional diagnostics easter egg on Lifan Hu’s website.', noindex: true,
  },
  '/visitors': {
    title: 'Visitors | Lifan Hu', titleZh: 'Visitors | Lifan Hu', heading: 'Visitor counts',
    description: 'Aggregate, anonymous browser-day counts for anormalm.com.', noindex: true,
  },
};

export const NOT_FOUND = {
  title: 'Page not found | Lifan Hu', titleZh: '页面未找到｜胡立凡', heading: 'Page not found',
  description: 'This page could not be found. Explore Lifan Hu’s projects, writing, and research from the homepage.', noindex: true,
};

export const normalizePath = (path) => path.replace(/\/+$/, '') || '/';
export const canonicalUrl = (path) => `${SITE_URL}${normalizePath(path) === '/' ? '/' : `${normalizePath(path)}/`}`;
export const pageForPath = (path) => PAGES[normalizePath(path)] || NOT_FOUND;
