import path from 'node:path';
import SQLite from 'better-sqlite3';

const DB_FILENAME = 'database.sqlite';

let db: InstanceType<typeof SQLite> | null = null;

export function getDatabasePath(): string {
  return path.join(process.cwd(), DB_FILENAME);
}

export function getDb(): InstanceType<typeof SQLite> {
  if (!db) {
    db = new SQLite(getDatabasePath());
    db.pragma('journal_mode = WAL');
  }
  return db;
}

export function initDb(): void {
  const database = getDb();

  // AI note: Schema — accounts for listing; account_settings stores arbitrary keys as JSON text per account.
  database.exec(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS account_settings (
      account_id TEXT NOT NULL,
      setting_key TEXT NOT NULL,
      setting_value TEXT NOT NULL,
      PRIMARY KEY (account_id, setting_key)
    );
  `);

  // AI note: Dev convenience — empty DB gets three fixed IDs the UI can select immediately.
  const row = database.prepare('SELECT COUNT(*) AS c FROM accounts').get() as { c: number };
  if (row.c === 0) {
    const insert = database.prepare('INSERT INTO accounts (id, name) VALUES (?, ?)');
    insert.run('1', 'Account 1');
    insert.run('2', 'Account 2');
    insert.run('3', 'Account 3');
  }
}
