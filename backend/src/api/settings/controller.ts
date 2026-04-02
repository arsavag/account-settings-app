import { getDb } from '../../configs/database';
import { DEFAULT_SETTINGS } from '../../configs/defaultSettings';

export async function getSettingsForAccount(accountId: string) {
  const db = await getDb();
  const rows = await db.all<{ setting_key: string; setting_value: string }[]>(
    'SELECT setting_key, setting_value FROM account_settings WHERE account_id = ?',
    accountId
  );
  const stored: Record<string, unknown> = {};
  for (const row of rows) {
    stored[row.setting_key] = JSON.parse(row.setting_value);
  }
  return { ...DEFAULT_SETTINGS, ...stored };
}

export async function saveSettingsForAccount(accountId: string, settings: Record<string, unknown>) {
  const db = await getDb();
  for (const [key, value] of Object.entries(settings)) {
    await db.run(
      `INSERT INTO account_settings (account_id, setting_key, setting_value)
        VALUES (?, ?, ?)
        ON CONFLICT(account_id, setting_key) DO UPDATE SET setting_value = excluded.setting_value`,
      accountId,
      key,
      JSON.stringify(value)
    );
  }
}
