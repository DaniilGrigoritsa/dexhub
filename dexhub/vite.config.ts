import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { checker } from 'vite-plugin-checker';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  server: {
    open: true,
    port: 3000,
    host: 'localhost',
  },
  resolve: {
    alias: {
      '#src': resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
        @use "sanitize.css";
        @use "sanitize.css/forms.css";
        @use "sanitize.css/typography.css";
        @use "@rainbow-me/rainbowkit/styles.css";
        `,
      },
    },
  },
  plugins: [react(), checker({ typescript: true }), svgr()],
});
