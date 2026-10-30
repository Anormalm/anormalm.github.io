import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { parse } from 'espree';

const root = new URL('../', import.meta.url);
const messages = new Set();
const reviewedChinese = {};
const excludedKeys = new Set(['sample', 'className', 'class', 'id', 'key', 'href', 'src', 'link', 'live', 'path', 'mode', 'type', 'keywords', 'layoutId', 'fontFamily', 'background', 'backgroundColor', 'color', 'border', 'boxShadow', 'filter', 'transform', 'cursor', 'display', 'alignItems', 'justifyContent', 'textAlign', 'textTransform', 'whiteSpace', 'overflow']);
const protectedText = new Set(['Lifan Hu', 'Hu Lifan', 'Anormalm', 'LH', 'LIFAN', 'HU', 'TikTok', 'GitHub', 'LinkedIn', 'Medium', 'Python', 'PyTorch', 'Docker', 'FastAPI', 'Transformers', 'C/C++', 'JavaScript', 'Gaspard de la Nuit', 'Ravel / Gaspard de la Nuit']);
const normalize = (value) => value.replace(/\s+/g, ' ').trim();
const add = (value) => {
  const text = normalize(value);
  if (!/[a-zA-Z]{2}/.test(text) || /[\u3400-\u9fff]/.test(text) || protectedText.has(text)) return;
  if (/https?:|mailto:|@|^[./#_\[(]|--|var\(|rgba?\(|[{}][^0-9]|=>|^\d+(?:deg|px)|\b(?:bg|text|font|border|rounded|gap|p|px|py|md|lg|sm|xl|hover|dark)-|^anormalm-|^site-|^geo-|^language-/.test(text)) return;
  if (/^[a-z][a-z-]+$/.test(text) && text.length > 14) return;
  messages.add(text);
};
const children = (node) => Object.values(node).flatMap((value) => Array.isArray(value) ? value : value && typeof value === 'object' ? [value] : []).filter((value) => value && typeof value.type === 'string');
const visit = (node, ancestors = []) => {
  const parent = ancestors.at(-1);
  const property = parent?.type === 'Property' ? parent.key.name || parent.key.value : null;
  const attribute = ancestors.findLast((item) => item.type === 'JSXAttribute')?.name?.name;
  const excluded = excludedKeys.has(property) || excludedKeys.has(attribute) || ancestors.some((item) => ['ImportDeclaration', 'ImportExpression'].includes(item.type));
  if (!excluded) {
    if (node.type === 'Literal' && typeof node.value === 'string') add(node.value);
    if (node.type === 'JSXText') add(node.value);
    if (node.type === 'TemplateLiteral') add(node.quasis.map((part, index) => part.value.cooked + (index < node.expressions.length ? `{${index}}` : '')).join(''));
  }
  if (node.type === 'ConditionalExpression' && node.test.type === 'Identifier' && node.test.name === 'isChinese' && typeof node.consequent.value === 'string' && typeof node.alternate.value === 'string') {
    reviewedChinese[normalize(node.alternate.value)] = normalize(node.consequent.value);
  }
  if (node.type === 'ObjectExpression') {
    const props = Object.fromEntries(node.properties.filter((item) => item.type === 'Property').map((item) => [item.key.name || item.key.value, item.value]));
    for (const [key, value] of Object.entries(props)) {
      if (typeof value.value === 'string' && typeof props[`${key}Zh`]?.value === 'string') reviewedChinese[normalize(value.value)] = normalize(props[`${key}Zh`].value);
    }
  }
  for (const child of children(node)) visit(child, [...ancestors, node]);
};
const scan = async (directory) => {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) { if (!['i18n', 'locales'].includes(entry.name)) await scan(new URL(`${entry.name}/`, directory)); }
    else if (/\.jsx?$/.test(entry.name) && !['siteLanguages.js', 'automaticLanguage.js', 'languageSuggestion.js'].includes(entry.name)) {
      const source = await readFile(new URL(entry.name, directory), 'utf8');
      visit(parse(source, { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } }));
    }
  }
};
await scan(new URL('src/', root));
for (const value of ['I build systems that think and move.', 'Ideas made testable.', 'I read the world.', 'Let’s make something strange.', 'All languages stay on this website.', 'Translations are stored with the site. Technical names and PDFs keep their original wording.', 'Language unavailable. Please try again.', 'Loading language…', 'Automatically chosen from your IP country. Your selection takes priority.']) add(value);
const list = [...messages].sort((a, b) => a.localeCompare(b, 'en'));
await mkdir(new URL('src/locales/', root), { recursive: true });
await writeFile(new URL('src/locales/en.json', root), JSON.stringify(Object.fromEntries(list.map((text) => [text, text])), null, 2) + '\n');
await writeFile(new URL('src/locales/zh-reviewed.json', root), JSON.stringify(Object.fromEntries(Object.entries(reviewedChinese).filter(([key]) => messages.has(key))), null, 2) + '\n');

// Temporary, unlinked authoring page. Export translated text into stored JSON;
// visitors will never need this service once the locale packs are checked in.
const escape = (text) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const content = list.map((text) => `<p data-source="${escape(encodeURIComponent(text))}">${escape(text).replace(/\{\d+\}/g, '<span translate="no">$&</span>')}</p>`).join('\n');
await mkdir(new URL('public/locale-authoring/', root), { recursive: true });
await writeFile(new URL('public/locale-authoring/index.html', root), `<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="robots" content="noindex,nofollow"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Website translation catalog</title><style>body{font:16px/1.5 system-ui;max-width:900px;margin:24px auto;padding:20px}p{padding:10px;border-bottom:1px solid #ddd}button{position:fixed;top:8px;right:8px;padding:16px}</style><script src="https://anormalm.com/locale-authoring/export.js" defer></script></head><body><button id="export-locale" translate="no">Export language JSON</button><h1>Website translation catalog</h1><main>${content}</main></body></html>`);
console.log(`Extracted ${list.length} English messages; ${Object.keys(reviewedChinese).length} authored Chinese pairs.`);
