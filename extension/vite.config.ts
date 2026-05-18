import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';
import { copyFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';

// Copies /public into /dist while preserving subpaths and gives us full control
// over output filenames for the multi-entry MV3 build.
function copyPublic() {
  return {
    name: 'copy-public',
    closeBundle() {
      const src = resolve(__dirname, 'public');
      const dst = resolve(__dirname, 'dist');
      const walk = (from: string, to: string) => {
        if (!existsSync(from)) return;
        mkdirSync(to, { recursive: true });
        for (const entry of readdirSync(from, { withFileTypes: true })) {
          const fp = resolve(from, entry.name);
          const tp = resolve(to, entry.name);
          if (entry.isDirectory()) walk(fp, tp);
          else copyFileSync(fp, tp);
        }
      };
      walk(src, dst);
    },
  };
}

export default defineConfig({
  plugins: [react(), copyPublic()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        sidebar: resolve(__dirname, 'src/sidebar/index.html'),
        background: resolve(__dirname, 'src/background/service-worker.ts'),
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        // Predictable filenames so manifest.json paths resolve.
        entryFileNames: (chunk) => {
          if (chunk.name === 'background') return 'background/service-worker.js';
          if (chunk.name === 'content') return 'content/index.js';
          return 'assets/[name]-[hash].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
