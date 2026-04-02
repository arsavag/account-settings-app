import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
//
// The app uses absolute API URLs from `src/config/apiConfig.ts` (`VITE_API_BASE_URL` or
// http://localhost:3000). Those requests do NOT go through this proxy.
//
// For a backend on Render (or any host), set in `.env.development` / `.env.local`:
//   VITE_API_BASE_URL=https://your-service.onrender.com
// (no `/api` suffix). Ensure the API allows CORS for http://localhost:5173.
//
// This proxy only applies if you change the client to use same-origin paths like `/api/...`.
// Then optional: VITE_DEV_PROXY_TARGET=https://your-service.onrender.com
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_DEV_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: proxyTarget.startsWith('https:'),
        },
      },
    },
  };
});
