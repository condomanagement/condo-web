import { PasskeyManagerWrapper } from './managers/PasskeyManagerWrapper';
import type { PasskeyCredential } from './managers/PasskeyManagerWrapper';
import DeleteIcon from '@mui/icons-material/Delete';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import { get as getCookie } from 'es-cookie';
import React, { useEffect, useState } from 'react';
import { getDeviceName } from './utils/passkey';

export default function PasskeySettings(): React.ReactElement {
  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const passkeyManager = new PasskeyManagerWrapper();

  const loadPasskeys = async (): Promise<void> => {
    try {
      setLoading(true);
      const list = await passkeyManager.listCredentials();
      setPasskeys(list);
      setError(null);
    } catch (err) {
      console.error('Failed to load passkeys:', err);
      setError('Failed to load passkeys');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPasskeys();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAdd = async (): Promise<void> => {
    setIsAdding(true);
    setError(null);

    try {
      const token = getCookie('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      const result = await passkeyManager.register(token, getDeviceName());

      if (result.success) {
        await loadPasskeys();
      } else {
        setError(result.error || 'Failed to add passkey');
      }
    } catch (err) {
      console.error('Failed to add passkey:', err);
      if (err instanceof Error) {
        console.error('Error details:', err.message, err.stack);
      }
      if (typeof err === 'object' && err !== null) {
        console.error('Full error:', JSON.stringify(err, null, 2));
      }
      setError(
        'Failed to add passkey. Check console for details. ' +
        (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this passkey? ' +
      'You will no longer be able to use it to sign in.'
    );
    if (!confirmed) return;

    try {
      const token = getCookie('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      await passkeyManager.deleteCredential(id);
      await loadPasskeys();
    } catch (err) {
      console.error('Failed to delete passkey:', err);
      setError('Failed to delete passkey');
    }
  };

  const formatDate = (dateStr?: string | null): string => {
    if (!dateStr) return 'Never used';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h5" component="h2">
            <FingerprintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Passkeys
          </Typography>
          <Button
            variant="contained"
            startIcon={<FingerprintIcon />}
            onClick={handleAdd}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add Passkey'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Passkeys let you sign in with your fingerprint, face, or device PIN.
          They&apos;re more secure than passwords and work across all your devices.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {passkeys.length === 0 ? (
          <Alert severity="info">
            You don&apos;t have any passkeys set up yet. Add one to make signing in faster and more secure.
          </Alert>
        ) : (
          <List>
            {passkeys.map((passkey) => (
              <ListItem
                key={passkey.id}
                secondaryAction={
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDelete(passkey.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                }
                sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
              >
                <ListItemText
                  primary={passkey.nickname}
                  secondary={`Added ${formatDate(passkey.created_at)} • Last used ${formatDate(passkey.last_used_at)}`}
                />
              </ListItem>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
