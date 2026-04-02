import path from 'node:path';
import sqlite3 from 'sqlite3';
import { open, type Database } from 'sqlite';

const DB_FILENAME = 'database.sqlite';

let db: Database | null = null;

export function getDatabasePath(): string {
  return path.join(process.cwd(), DB_FILENAME);
}

export async function getDb(): Promise<Database> {
  if (!db) {
    db = await open({
      filename: getDatabasePath(),
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function initDb(): Promise<void> {
  const db = await getDb();
  await db.exec(`
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
  
  const accounts = await db.all('SELECT id, name FROM accounts');
  if (accounts.length === 0) {
    await db.run(`
      INSERT INTO accounts (id, name) VALUES 
      ('1', 'Account 1'),
      ('2', 'Account 2'),
      ('3', 'Account 3')
    `);
  }

}
