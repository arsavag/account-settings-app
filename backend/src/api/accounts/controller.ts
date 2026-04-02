import { getDb } from '../../configs/database';

export async function listAccounts() {
  const db = await getDb();
  return db.all<{ id: string; name: string }[]>('SELECT id, name FROM accounts');
}
