import type { Setting } from '../types/settings';

export const SETTINGS_CONFIG: Setting[] = [
  {
    id: 'notifications',
    label: 'Enable notifications',
    type: 'boolean',
    defaultValue: true,
  },
  {
    id: 'supportEmail',
    label: 'Support email',
    type: 'text',
    defaultValue: '',
  },
  {
    id: 'dailyLimit',
    label: 'Daily email limit',
    type: 'number',
    defaultValue: 10,
    min: 1,
    max: 100,
  },
  {
    id: 'timezone',
    label: 'Timezone',
    type: 'select',
    options: [
      { value: 'UTC', label: 'UTC' },
      { value: 'EST', label: 'Eastern Time' },
      { value: 'PST', label: 'Pacific Time' },
      { value: 'GMT', label: 'Greenwich Mean Time' },
    ],
    defaultValue: 'UTC',
  },
  {
    id: 'allowedChannels',
    label: 'Allowed channels',
    type: 'multiselect',
    options: [
      { value: 'email', label: 'Email' },
      { value: 'sms', label: 'SMS' },
      { value: 'push', label: 'Push Notification' },
    ],
    defaultValue: [],
  },
];