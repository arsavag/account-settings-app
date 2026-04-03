import { getDb } from '../../configs/database.js';

export async function listAccounts() {
  const rows = getDb()
    .prepare('SELECT id, name FROM accounts')
    .all() as { id: string; name: string }[];
  return rows;
}
