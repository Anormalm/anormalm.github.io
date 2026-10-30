import { mkdir, readFile, writeFile } from 'node:fs/promises';

// Google serves translated HTML on a different origin and injects its own
// translation scripts. Give that entry its own policy; keep the main site's
// stricter policy unchanged. Explicit asset URLs avoid proxy-relative modules.
const policy = [
  "default-src 'self' https://anormalm.com",
  "script-src 'self' https://anormalm.com https://www.gstatic.com https://translate.googleapis.com 'unsafe-inline'",
  "style-src 'self' https://anormalm.com https://fonts.googleapis.com https://www.gstatic.com 'unsafe-inline'",
  "font-src 'self' https://anormalm.com https://fonts.gstatic.com data:",
  "img-src 'self' https://anormalm.com https://www.google.com https://www.gstatic.com https://translate.googleapis.com data: blob:",
  "connect-src 'self' https://anormalm.com https://api.country.is https://whatismyip.technology https://translate.googleapis.com https://translate-pa.googleapis.com",
  "object-src 'none'",
  'base-uri https://anormalm.com',
  "form-action 'self'",
  "frame-src 'none'",
  'upgrade-insecure-requests',
].join('; ');

const original = await readFile(new URL('../dist/index.html', import.meta.url), 'utf8');
const translated = original
  .replace(/(<meta http-equiv="Content-Security-Policy" content=")[^"]+("\s*\/?>)/, `$1${policy}$2`)
  .replace(/\b(src|href)="\/(?!\/)/g, '$1="https://anormalm.com/');
await mkdir(new URL('../dist/translate/', import.meta.url), { recursive: true });
await writeFile(new URL('../dist/translate/index.html', import.meta.url), translated);
console.log('Built translation entry with absolute assets.');
