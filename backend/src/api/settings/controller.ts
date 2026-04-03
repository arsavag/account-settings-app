import { getDb } from '../../configs/database.js';
import { DEFAULT_SETTINGS } from '../../configs/defaultSettings.js';

// AI note: Read stored JSON values per key; merge with server defaults so the client always gets a full shape.
export async function getSettingsForAccount(accountId: string) {
  const rows = getDb()
    .prepare('SELECT setting_key, setting_value FROM account_settings WHERE account_id = ?')
    .all(accountId) as { setting_key: string; setting_value: string }[];

  const stored: Record<string, unknown> = {};
  for (const row of rows) {
    stored[row.setting_key] = JSON.parse(row.setting_value);
  }
  return { ...DEFAULT_SETTINGS, ...stored };
}

// AI note: Upsert all keys in one transaction; values are JSON-stringified in SQLite.
export async function saveSettingsForAccount(accountId: string, settings: Record<string, unknown>) {
  const db = getDb();
  const stmt = db.prepare(
    `INSERT INTO account_settings (account_id, setting_key, setting_value)
      VALUES (?, ?, ?)
      ON CONFLICT(account_id, setting_key) DO UPDATE SET setting_value = excluded.setting_value`
  );

  const run = db.transaction(() => {
    for (const [key, value] of Object.entries(settings)) {
      stmt.run(accountId, key, JSON.stringify(value));
    }
  });
  run();
}
