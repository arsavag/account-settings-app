import { useEffect, useState } from 'react';
import { Alert, CircularProgress, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { getAccounts } from '../services/api';

export const AccountList = ({
  selectedAccountId,
  onSelectAccount,
}: {
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}) => {
  const [accounts, setAccounts] = useState<{ id: string; name: string }[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getAccounts()
      .then((rows) => {
        if (!cancelled) setAccounts(rows);
      })
      .catch((e) => {
        if (!cancelled) {
          setAccounts(null);
          setError(e instanceof Error ? e.message : 'Failed to load accounts');
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }
  if (accounts === null) {
    return <CircularProgress size={28} />;
  }

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Accounts
      </Typography>
      <List>
        {accounts.map((account) => (
          <ListItemButton
            key={account.id}
            selected={selectedAccountId === account.id}
            onClick={() => onSelectAccount(account.id)}
          >
            <ListItemText primary={account.name} />
          </ListItemButton>
        ))}
      </List>
    </>
  );
};
