import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { PAGES, NOT_FOUND, SITE_URL, canonicalUrl } from '../src/data/pages.js';
import { projects, publications, writings } from '../src/data/portfolio.js';

const dist = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', dist), 'utf8');
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const link = (href, text) => `<a href="${escape(href)}">${escape(text)}</a>`;
const list = (items) => `<ul>${items.map((item) => `<li>${item}</li>`).join('')}</ul>`;
const projectList = (items) => list(items.map((project) => `${link(project.live || project.link, project.title)} — ${escape(project.description)}`));

const contentFor = (path) => {
  if (path === '/') return `<p>I'm Lifan Hu, a Machine Learning Engineer Intern at TikTok and Research Assistant at NUS.</p><h2>Selected work</h2>${projectList(projects.filter((project) => project.featured))}`;
  if (path === '/projects') return projectList(projects);
  if (path === '/writings') return list(writings.map((writing) => `${link(writing.link, writing.title)} — ${escape(writing.excerpt)}`));
  if (path === '/cv') return `<p>CV update in progress. PDF downloads are temporarily unavailable.</p><h2>Experience</h2><ul><li>Machine Learning Engineer Intern · TikTok · BRIC</li><li>Research Assistant · National University of Singapore · DistDNA</li><li>Digital Developer Intern · MAHLE Thermal Systems</li></ul><h2>Publications</h2>${list(publications.map((publication) => `${publication.link ? link(publication.link, publication.title) : escape(publication.title)} — ${escape(publication.venue)}`))}`;
  if (path === '/contact') return `<p>${link('mailto:anormalm@outlook.com', 'Email Lifan: anormalm@outlook.com')}</p>`;
  if (path === '/lab') return '<p>Explore Hamiltonian flow, cursor vector fields, Kalman tracking, and other interactive systems. Enable JavaScript to use the controls.</p>';
  if (path === '/privacy') return '<p>Visit counts retain only the UTC day, country code, broad 30° map region, and count for 90 days. Global Privacy Control and Do Not Track disable counting. Optional city lookup runs only after you request it; automatic country-based language selection is described on this page.</p>';
  return '';
};

const navigation = `<nav aria-label="Main navigation">${Object.entries(PAGES).filter(([, page]) => !page.noindex).map(([path, page]) => link(new URL(canonicalUrl(path)).pathname, path === '/' ? 'Home' : page.title.split(' | ')[0])).join(' · ')}</nav>`;
const render = (path, page) => {
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escape(page.title)}</title>`);
  const tags = {
    'name="description"': page.description,
    'name="robots"': page.noindex ? 'noindex, follow' : 'index, follow',
    'property="og:title"': page.title,
    'property="og:description"': page.description,
    'property="og:url"': canonicalUrl(path),
    'name="twitter:title"': page.title,
    'name="twitter:description"': page.description,
  };
  for (const [attribute, value] of Object.entries(tags)) {
    html = html.replace(new RegExp(`(<meta ${attribute} content=")[^"]*("\\s*/?>)`), `$1${escape(value)}$2`);
  }
  html = html.replace(/(<link rel="canonical" href=")[^"]*("\s*\/?>)/, `$1${canonicalUrl(path)}$2`);
  const content = `<div class="section static-page">${navigation}<h1 class="font-display mt-8 text-4xl">${escape(page.heading)}</h1><p class="mt-5">${escape(page.description)}</p>${contentFor(path)}</div>`;
  return html.replace('<div id="root"></div>', `<div id="root"><main>${content}</main></div>`);
};

for (const [path, page] of Object.entries(PAGES)) {
  const directory = new URL(path === '/' ? './' : `${path.slice(1)}/`, dist);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), render(path, page));
}
// Unknown paths retain an actual HTTP 404, with a useful fallback and the same
// client assets. Known routes above no longer depend on a JavaScript redirect.
await writeFile(new URL('404.html', dist), render('/404', NOT_FOUND));
await writeFile(new URL('robots.txt', dist), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
const researchFiles = (await readdir(new URL('misgraph/', dist))).filter((name) => name.endsWith('.html'));
const urls = [
  ...Object.entries(PAGES).filter(([, page]) => !page.noindex).map(([path]) => canonicalUrl(path)),
  ...researchFiles.map((name) => `${SITE_URL}/misgraph/${name === 'index.html' ? '' : name}`),
];
await writeFile(new URL('sitemap.xml', dist), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join('\n')}\n</urlset>\n`);
