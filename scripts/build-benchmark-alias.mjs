import { cp, readdir, writeFile } from 'node:fs/promises';

// Keep historical direct downloads and assets available at their original URLs.
await cp('dist/misgraph', 'dist/groundlm', { recursive: true });
for (const file of await readdir('dist/misgraph')) {
  if (!file.endsWith('.html')) continue;
  const target = '/misgraph/' + (file === 'index.html' ? '' : file);
  await writeFile(`dist/groundlm/${file}`, `<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>MisGraph Benchmark — moved</title>
<link rel="canonical" href="https://anormalm.com${target}">
<script>location.replace(${JSON.stringify(target)} + location.search + location.hash);</script>
<noscript><meta http-equiv="refresh" content="0;url=${target}"></noscript>
</head><body><main><h1>MisGraph Benchmark</h1>
<p>The benchmark has moved. <a href="${target}">Continue to MisGraph</a>.</p>
</main></body></html>\n`);
}
