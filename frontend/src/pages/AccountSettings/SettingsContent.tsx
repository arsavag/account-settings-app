import { use, useMemo } from "react";
import { DynamicForm } from "../../components/DynamicForm";
import { SETTINGS_CONFIG } from "../../config/settingsConfig";
import { getSettings } from "../../services/api";
import type { SettingsValues } from "../../types/settings";

interface SettingsContentProps {
  accountId: string;
  onSubmit: (data: SettingsValues) => Promise<void>;
}

export default function SettingsContent({ accountId, onSubmit }: SettingsContentProps) {
  const settingsPromise = useMemo(() => getSettings(accountId), [accountId]);
  const settings = use(settingsPromise);

  return (
    <DynamicForm
      key={accountId}
      config={SETTINGS_CONFIG}
      defaultValues={settings}
      onSubmit={onSubmit}
    />
  );
}
