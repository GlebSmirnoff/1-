// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // Загальний alias до src
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      // Конкретні alias для UI
      { find: '@/components/ui', replacement: path.resolve(__dirname, 'src/components/ui') }
    ],
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.json']
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: { 'localhost': '' }
      }
    }
  }
});