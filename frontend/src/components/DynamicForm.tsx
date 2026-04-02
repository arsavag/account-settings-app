import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Checkbox,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import type { Setting, SettingsValues } from '../types/settings';

interface Props {
  config: Setting[];
  defaultValues: SettingsValues;
  onSubmit: (data: SettingsValues) => Promise<void>;
}

export const DynamicForm: React.FC<Props> = ({ config, defaultValues, onSubmit }) => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({ defaultValues });

  const renderField = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <Controller
            name={setting.id}
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={<Switch checked={field.value} onChange={(e) => field.onChange(e.target.checked)} />}
                label={setting.label}
              />
            )}
          />
        );

      case 'text':
        return (
          <Controller
            name={setting.id}
            control={control}
            rules={{ required: `${setting.label} is required` }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label={setting.label}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        );

      case 'number':
        return (
          <Controller
            name={setting.id}
            control={control}
            rules={{
              required: `${setting.label} is required`,
              min: setting.min,
              max: setting.max,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="number"
                label={setting.label}
                fullWidth
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                onChange={(e) => field.onChange(Number(e.target.value))}
              />
            )}
          />
        );

      case 'select':
        return (
          <Controller
            name={setting.id}
            control={control}
            rules={{ required: `${setting.label} is required` }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>{setting.label}</InputLabel>
                <Select {...field} label={setting.label}>
                  {setting.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      case 'multiselect':
        return (
          <Controller
            name={setting.id}
            control={control}
            rules={{ required: `${setting.label} is required` }}
            render={({ field, fieldState }) => (
              <FormControl fullWidth error={!!fieldState.error}>
                <InputLabel>{setting.label}</InputLabel>
                <Select
                  multiple
                  {...field}
                  label={setting.label}
                  renderValue={(selected) => (selected as string[]).join(', ')}
                >
                  {setting.options.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <Checkbox checked={field.value?.includes(opt.value)} />
                      <ListItemText primary={opt.label} />
                    </MenuItem>
                  ))}
                </Select>
                {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
              </FormControl>
            )}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {config.map((setting) => (
        <Box key={setting.id}>{renderField(setting)}</Box>
      ))}
      <Button type="submit" variant="contained" disabled={isSubmitting} sx={{ alignSelf: 'flex-start' }}>
        {isSubmitting ? <CircularProgress size={24} /> : 'Save Settings'}
      </Button>
    </Box>
  );
};