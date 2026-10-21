import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// Resolve a path relative to this config file (= project root)
function src(...segments) {
  return fileURLToPath(new URL(['./src', ...segments].join('/'), import.meta.url));
}

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Generic @/ → src/  (used by "@/routes/AppRouter")
      '@': src(),

      // Named directory aliases used throughout the codebase
      '@context':    src('context'),
      '@hooks':      src('hooks'),
      '@utils':      src('utils'),
      '@services':   src('services'),
      '@components': src('components'),
      '@pages':      src('pages'),
      '@styles':     src('styles'),
    },
  },
});
