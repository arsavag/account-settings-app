/* eslint-disable @typescript-eslint/no-explicit-any */
export type SettingType = 'boolean' | 'text' | 'number' | 'select' | 'multiselect';

export interface BaseSetting {
  id: string;
  label: string;
  type: SettingType;
}

export interface BooleanSetting extends BaseSetting {
  type: 'boolean';
  defaultValue: boolean;
}

export interface TextSetting extends BaseSetting {
  type: 'text';
  defaultValue: string;
}

export interface NumberSetting extends BaseSetting {
  type: 'number';
  defaultValue: number;
  min?: number;
  max?: number;
}

export interface SelectSetting extends BaseSetting {
  type: 'select';
  options: { value: string; label: string }[];
  defaultValue: string;
}

export interface MultiselectSetting extends BaseSetting {
  type: 'multiselect';
  options: { value: string; label: string }[];
  defaultValue: string[];
}

export type Setting = BooleanSetting | TextSetting | NumberSetting | SelectSetting | MultiselectSetting;
export type SettingsValues = Record<string, any>;