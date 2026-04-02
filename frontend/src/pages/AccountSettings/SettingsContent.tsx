import { useEffect, useState } from 'react';
import { Alert, CircularProgress } from '@mui/material';
import { DynamicForm } from '../../components/DynamicForm';
import { SETTINGS_CONFIG } from '../../config/settingsConfig';
import { getSettings } from '../../services/api';
import type { SettingsValues } from '../../types/settings';

function mergeWithFormDefaults(apiValues: SettingsValues): SettingsValues {
  const defaults: SettingsValues = {};
  for (const field of SETTINGS_CONFIG) {
    defaults[field.id] = field.defaultValue;
  }
  return { ...defaults, ...apiValues };
}

interface SettingsContentProps {
  accountId: string;
  onSubmit: (data: SettingsValues) => Promise<void>;
}

export default function SettingsContent({ accountId, onSubmit }: SettingsContentProps) {
  const [settings, setSettings] = useState<SettingsValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getSettings(accountId)
      .then(mergeWithFormDefaults)
      .then((data) => {
        if (!cancelled) {
          setSettings(data);
          setError(null);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setSettings(null);
          setError(e instanceof Error ? e.message : 'Failed to load settings');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [accountId]);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (settings === null) {
    return <CircularProgress size={28} sx={{ display: 'block', mx: 'auto', my: 2 }} />;
  }

  return (
    <DynamicForm
      key={accountId}
      config={SETTINGS_CONFIG}
      defaultValues={settings}
      onSubmit={onSubmit}
    />
  );
}
