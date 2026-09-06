import { cp, mkdir } from 'node:fs/promises';

await mkdir('dist/server', { recursive: true });
await cp('worker', 'dist/server', { recursive: true });
