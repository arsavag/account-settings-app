import { Router } from 'express';
import { getSettingsForAccount, saveSettingsForAccount } from './controller';

const router = Router();

router.get('/:accountId', async (req, res) => {
  try {
    const settings = await getSettingsForAccount(req.params.accountId);
    res.json(settings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get settings' });
  }
});

router.put('/:accountId', async (req, res) => {
  try {
    await saveSettingsForAccount(req.params.accountId, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save settings' });
  }
});

export default router;