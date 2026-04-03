// AI note: Central mount for REST feature routers; paths are /api/accounts and /api/settings/:accountId.
import { Application } from 'express';
import accountsRoutes from './api/accounts/routes.js';
import settingsRoutes from './api/settings/routes.js';

export function useRoutes(app: Application) {
  app.use('/api/accounts', accountsRoutes);
  app.use('/api/settings', settingsRoutes);
}
