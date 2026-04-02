import { Suspense, useCallback, useState, useTransition } from 'react';
import { Container, Grid, Paper, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import SettingsContent from './SettingsContent';
import { AccountList } from '../../components/AccountList';
import type { SettingsValues } from '../../types/settings';
import { saveSettings } from '../../services/api';

export const AccountSettings = () => {
  const [selectedAccount, setSelectedAccount] = useState<string | null>(null);
  const [, startAccountTransition] = useTransition();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const handleSelectAccount = useCallback(
    (id: string) => {
      startAccountTransition(() => setSelectedAccount(id));
    },
    [startAccountTransition]
  );

  const handleSubmit = useCallback(
    async (data: SettingsValues) => {
      if (!selectedAccount) return;
      try {
        await saveSettings(selectedAccount, data);
        setSnackbar({ open: true, message: 'Settings saved successfully', severity: 'success' });
      } catch {
        setSnackbar({ open: true, message: 'Failed to save settings', severity: 'error' });
      }
    },
    [selectedAccount]
  );

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Account Settings
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2 }}>
            <AccountList
              selectedAccountId={selectedAccount ?? ''}
              onSelectAccount={handleSelectAccount}
            />
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 3 }}>
            {!selectedAccount && (
              <Typography color="textSecondary">Select an account to manage settings</Typography>
            )}
            {selectedAccount && (
              <Suspense fallback={<CircularProgress />}>
                <SettingsContent accountId={selectedAccount} onSubmit={handleSubmit} />
              </Suspense>
            )}
          </Paper>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};
