import { Application } from 'express';
import accountsRoutes from './api/accounts/routes.js';
import settingsRoutes from './api/settings/routes.js';

export function useRoutes(app: Application) {
  app.use('/api/accounts', accountsRoutes);
  app.use('/api/settings', settingsRoutes);
}
