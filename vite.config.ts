import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { atelierVersionPlugin } from './vite.atelier-version';

const githubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: githubPages ? '/atelier-os-0.1.0/' : '/',
  server: {
    port: 5191,
    strictPort: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5191,
    },
  },
  plugins: [react(), atelierVersionPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/jspdf')) return 'pdf-vendor';
          if (id.includes('node_modules/html2canvas')) return 'canvas-vendor';
          if (id.includes('node_modules/qrcode')) return 'qrcode-vendor';
        },
      },
    },
  },
});
