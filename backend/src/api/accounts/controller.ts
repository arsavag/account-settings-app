import { getDb } from '../../configs/database.js';

// AI note: Simple read for the account picker; data comes from `accounts` (seeded in initDb if empty).
export async function listAccounts() {
  const rows = getDb()
    .prepare('SELECT id, name FROM accounts')
    .all() as { id: string; name: string }[];
  return rows;
}
