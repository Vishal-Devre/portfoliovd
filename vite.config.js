import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  base: '/',  // Keep as '/' if deploying to root domain
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