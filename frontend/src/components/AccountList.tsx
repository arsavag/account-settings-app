import { use } from 'react';
import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { getAccounts } from '../services/api';

const accountPromise = getAccounts();

export const AccountList = ({
  selectedAccountId,
  onSelectAccount,
}: {
  selectedAccountId: string;
  onSelectAccount: (id: string) => void;
}) => {
  const accounts = use(accountPromise);
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