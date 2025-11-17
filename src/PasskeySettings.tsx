import { PasskeyManager } from '@condomanagement/condo-brain';
import type { PasskeyCredential } from '@condomanagement/condo-brain';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { get as getCookie } from 'es-cookie';
import React, { useEffect, useState } from 'react';
import { getDeviceName } from './utils/passkey';

export default function PasskeySettings(): React.ReactElement {
  const [passkeys, setPasskeys] = useState<PasskeyCredential[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingPasskey, setRenamingPasskey] = useState<PasskeyCredential | null>(null);
  const [newNickname, setNewNickname] = useState('');
  const passkeyManager = new PasskeyManager();

  const loadPasskeys = async (): Promise<void> => {
    try {
      setLoading(true);
      const list = await passkeyManager.list();
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

      const result = await passkeyManager.register(getDeviceName());

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

      await passkeyManager.delete(id);
      await loadPasskeys();
    } catch (err) {
      console.error('Failed to delete passkey:', err);
      setError('Failed to delete passkey');
    }
  };

  const handleRenameClick = (passkey: PasskeyCredential): void => {
    setRenamingPasskey(passkey);
    setNewNickname(passkey.nickname);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = async (): Promise<void> => {
    if (!renamingPasskey || !newNickname.trim()) return;

    try {
      await passkeyManager.updateNickname(renamingPasskey.id, newNickname.trim());
      await loadPasskeys();
      setRenameDialogOpen(false);
      setRenamingPasskey(null);
      setNewNickname('');
    } catch (err) {
      console.error('Failed to rename passkey:', err);
      setError('Failed to rename passkey');
    }
  };

  const handleRenameCancel = (): void => {
    setRenameDialogOpen(false);
    setRenamingPasskey(null);
    setNewNickname('');
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
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => handleRenameClick(passkey)}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(passkey.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
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

        <Dialog open={renameDialogOpen} onClose={handleRenameCancel}>
          <DialogTitle>Rename Passkey</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Nickname"
              type="text"
              fullWidth
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleRenameSubmit();
                }
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleRenameCancel}>Cancel</Button>
            <Button onClick={handleRenameSubmit} variant="contained" disabled={!newNickname.trim()}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
