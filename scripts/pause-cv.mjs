import { rm } from 'node:fs/promises';

// Keep the source PDFs for the next revision, but do not publish downloads
// while the CV is being updated. This also disables the old direct URLs.
for (const name of ['CV-Lifan-Latest.pdf', 'CV-Revised-June-2025.pdf']) {
  await rm(new URL(`../dist/${name}`, import.meta.url), { force: true });
}
