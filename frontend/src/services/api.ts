import type { SettingsValues } from '../types/settings';
import { API_ROUTES } from '../config/apiConfig';
// import { SETTINGS_CONFIG } from '../config/settingsConfig';

// AI note: On 2xx, parse JSON body. On failure, read text once; use `error` from JSON if present, else body or status — then throw so callers get a clear message.
async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    let message = response.statusText;
    try {
      const json = JSON.parse(text) as { error?: string };
      if (json?.error) message = json.error;
    } catch {
      if (text) message = text;
    }
    throw new Error(message || `Request failed (${response.status})`);
  }
  return response.json() as Promise<T>;
}

type AccountRow = { id: string; name: string };

let accountsRequest: Promise<AccountRow[]> | null = null;

export async function getAccounts(): Promise<AccountRow[]> {
  if (!accountsRequest) {
    accountsRequest = (async () => {
      const response = await fetch(API_ROUTES.ACCOUNTS);
      return parseJsonResponse<AccountRow[]>(response);
    })().catch((err) => {
      accountsRequest = null;
      throw err;
    });
  }
  return accountsRequest;
}

const settingsRequestByAccountId = new Map<string, Promise<SettingsValues>>();

export async function getSettings(accountId: string): Promise<SettingsValues> {
  let pending = settingsRequestByAccountId.get(accountId);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(`${API_ROUTES.SETTINGS}/${encodeURIComponent(accountId)}`);
      return parseJsonResponse<SettingsValues>(response);
    })().catch((err) => {
      settingsRequestByAccountId.delete(accountId);
      throw err;
    });
    settingsRequestByAccountId.set(accountId, pending);
  }
  return pending;
}

export async function saveSettings(accountId: string, settings: SettingsValues): Promise<void> {
  const response = await fetch(`${API_ROUTES.SETTINGS}/${encodeURIComponent(accountId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(settings),
  });
  await parseJsonResponse<{ success?: boolean }>(response);
  settingsRequestByAccountId.delete(accountId);
}


// THIS IS A MOCK IMPLEMENTATION WITH THE LOCAL STORAGE

// const ACCOUNTS_STORAGE_KEY = 'mock_accounts';
// const SETTINGS_PREFIX = 'account_settings_';

// const defaultAccounts = [
//   { id: '1', name: 'Account 1' },
//   { id: '2', name: 'Account 2' },
//   { id: '3', name: 'Account 3' },
// ];

// const initAccounts = () => {
//   const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
//   if (!stored) {
//     localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultAccounts));
//   }
// };

// const getDefaultSettings = (): SettingsValues => {
//   const defaults: SettingsValues = {};
//   SETTINGS_CONFIG.forEach(setting => {
//     defaults[setting.id] = setting.defaultValue;
//   });
//   return defaults;
// };

// export const getAccounts = async (): Promise<{ id: string; name: string }[]> => {
//   initAccounts();
//   const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
//   return JSON.parse(stored!);
// };

// export const getSettings = async (accountId: string): Promise<SettingsValues> => {
//   const key = `${SETTINGS_PREFIX}${accountId}`;
//   const stored = localStorage.getItem(key);
//   const defaults = getDefaultSettings();
//   if (!stored) {
//     localStorage.setItem(key, JSON.stringify(defaults));
//     return defaults;
//   }
//   const saved = JSON.parse(stored);
//   return { ...defaults, ...saved };
// };

// export const saveSettings = async (accountId: string, settings: SettingsValues): Promise<void> => {
//   const key = `${SETTINGS_PREFIX}${accountId}`;
//   localStorage.setItem(key, JSON.stringify(settings));
//   return new Promise(resolve => setTimeout(resolve, 300));
// };
