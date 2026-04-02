/**
 * API origin only (no `/api` suffix). Override for production, e.g. GitHub Pages → hosted backend:
 * `VITE_API_BASE_URL=https://your-api.example.com`
 */
const BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, '') ?? 'http://localhost:3000';

const API_ROUTES = {
  ACCOUNTS: `${BASE}/api/accounts`,
  SETTINGS: `${BASE}/api/settings`,
};

export { API_ROUTES };
