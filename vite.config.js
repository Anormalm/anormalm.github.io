import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { sites } from '@openai/sites-vite-plugin';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react({ jsxImportSource: '@site-i18n' }), sites()],
  resolve: { alias: { '@site-i18n': fileURLToPath(new URL('./src/i18n', import.meta.url)) } },
  base: '/',
 });
