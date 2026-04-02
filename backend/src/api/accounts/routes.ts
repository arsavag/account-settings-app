import { Router } from 'express';
import { listAccounts } from './controller';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const accounts = await listAccounts();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

export default router;