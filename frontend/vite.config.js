import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode: _mode }) => {
  const base = process.env.VITE_BASE_PATH || (process.env.GH_PAGES === 'true' ? '/EDU-PAY/' : '/');
  return {
    base,
    plugins: [react()],
    server: {
      proxy: {
        '/api': 'http://localhost:5000',
      },
    },
  };
})
