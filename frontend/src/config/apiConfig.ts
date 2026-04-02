const BACKEND_BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined ?? 'http://localhost:3000';

const API_ROUTES = {
  ACCOUNTS: `${BACKEND_BASE_URL}/api/accounts`,
  SETTINGS: `${BACKEND_BASE_URL}/api/settings`,
};
export { API_ROUTES };
