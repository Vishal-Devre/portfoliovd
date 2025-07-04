import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: import.meta.env.VITE_BASE_PATH_ || /portfoliovd-zt8r/,
  plugins: [react(), tailwindcss()],
  server: {
    historyApiFallback: true,  // Required for React Router
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,  // Clear dist folder on rebuild
  },
  preview: {
    historyApiFallback: true,  // Required for `npm run preview`
  },
});