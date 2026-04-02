import type { SettingsValues } from '../types/settings';
import { SETTINGS_CONFIG } from '../config/settingsConfig';

const ACCOUNTS_STORAGE_KEY = 'mock_accounts';
const SETTINGS_PREFIX = 'account_settings_';

const defaultAccounts = [
  { id: '1', name: 'Account 1' },
  { id: '2', name: 'Account 2' },
  { id: '3', name: 'Account 3' },
];

const initAccounts = () => {
  const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(defaultAccounts));
  }
};

const getDefaultSettings = (): SettingsValues => {
  const defaults: SettingsValues = {};
  SETTINGS_CONFIG.forEach(setting => {
    defaults[setting.id] = setting.defaultValue;
  });
  return defaults;
};

export const getAccounts = async (): Promise<{ id: string; name: string }[]> => {
  initAccounts();
  const stored = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
  return JSON.parse(stored!);
};

export const getSettings = async (accountId: string): Promise<SettingsValues> => {
  const key = `${SETTINGS_PREFIX}${accountId}`;
  const stored = localStorage.getItem(key);
  const defaults = getDefaultSettings();
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  const saved = JSON.parse(stored);
  return { ...defaults, ...saved };
};

export const saveSettings = async (accountId: string, settings: SettingsValues): Promise<void> => {
  const key = `${SETTINGS_PREFIX}${accountId}`;
  localStorage.setItem(key, JSON.stringify(settings));
  return new Promise(resolve => setTimeout(resolve, 300));
};