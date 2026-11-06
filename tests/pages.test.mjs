import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { PAGES, SITE_URL, canonicalUrl } from '../src/data/pages.js';

const dist = new URL('../dist/', import.meta.url);
const read = (path) => readFile(new URL(path, dist), 'utf8');

test('each public route ships crawlable content, its own metadata, and working client assets', async () => {
  const descriptions = new Set();
  for (const [path, page] of Object.entries(PAGES)) {
    const html = await read(path === '/' ? 'index.html' : `${path.slice(1)}/index.html`);
    assert.equal(html.match(/<title>([^<]*)<\/title>/)[1].replaceAll('&amp;', '&'), page.title, path);
    assert.ok(html.includes(`rel="canonical" href="${canonicalUrl(path)}"`), path);
    assert.ok(html.includes(`property="og:url" content="${canonicalUrl(path)}"`), path);
    assert.match(html, /<main>.*<h1 /s, path);
    assert.ok(html.includes(`name="robots" content="${page.noindex ? 'noindex, follow' : 'index, follow'}"`));
    assert.doesNotMatch(html, /location\.replace|\?redirect=/, path);
    descriptions.add(page.description);
    for (const match of html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)) {
      assert.ok((await stat(new URL(match[1].slice(1), dist))).isFile(), match[1]);
    }
  }
  assert.equal(descriptions.size, Object.keys(PAGES).length);
  assert.match(await read('projects/index.html'), /MisGraph/);
  assert.match(await read('writings/index.html'), /We Are Too Impatient to Hack/);
});

test('GitHub Pages style directory hosting returns 200 for direct route visits and 404 for unknown paths', async () => {
  // Deliberately no SPA rewrite: only real files and directory indexes resolve.
  const server = createServer(async (request, response) => {
    const path = new URL(request.url, 'http://localhost').pathname;
    try {
      let file = new URL(`.${path}`, dist);
      if ((await stat(file)).isDirectory()) file = new URL('index.html', `${file.href.replace(/\/$/, '')}/`);
      const body = await readFile(file);
      response.writeHead(200, { 'Content-Type': 'text/html' }).end(body);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html' }).end(await read('404.html'));
    }
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  try {
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const path of Object.keys(PAGES)) {
      const response = await fetch(`${origin}${path}`);
      assert.equal(response.status, 200, path);
    }
    const missing = await fetch(`${origin}/this-page-does-not-exist`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /Page not found/);
    for (const file of ['CV-Lifan-Latest.pdf', 'CV-Revised-June-2025.pdf']) {
      assert.equal((await fetch(`${origin}/${file}`)).status, 404, file);
    }
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('CV update notice has no downloadable PDF in the published artifact', async () => {
  const html = await read('cv/index.html');
  assert.match(html, /CV update in progress/);
  assert.doesNotMatch(html, /href="[^"]*CV-[^"]*\.pdf/);
  for (const file of ['CV-Lifan-Latest.pdf', 'CV-Revised-June-2025.pdf']) {
    await assert.rejects(stat(new URL(file, dist)), { code: 'ENOENT' });
  }
});

test('robots and sitemap expose the canonical public routes and preserve the research pages', async () => {
  assert.ok((await read('robots.txt')).includes(`Sitemap: ${SITE_URL}/sitemap.xml`));
  const sitemap = await read('sitemap.xml');
  for (const [path, page] of Object.entries(PAGES)) {
    assert.equal(sitemap.includes(`<loc>${canonicalUrl(path)}</loc>`), !page.noindex, path);
  }
  assert.ok(sitemap.includes(`${SITE_URL}/misgraph/`));
  for (const [, url] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const path = new URL(url).pathname.slice(1);
    assert.ok((await stat(new URL(path.endsWith('/') || !path ? `${path}index.html` : path, dist))).isFile(), url);
  }
});
