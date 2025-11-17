import { PasskeyManagerWrapper } from './managers/PasskeyManagerWrapper';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { get as getCookie } from 'es-cookie';
import React, { useEffect, useState } from 'react';
import { getDeviceName, isPlatformAuthenticatorAvailable } from './utils/passkey';

interface PasskeySetupPromptProps {
  open: boolean;
  onClose: () => void;
  onSetupComplete: () => void;
}

export default function PasskeySetupPrompt({
  open,
  onClose,
  onSetupComplete,
}: PasskeySetupPromptProps): React.ReactElement {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passkeyManager = new PasskeyManagerWrapper();

  useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setIsSupported);
  }, []);

  const handleSetup = async (): Promise<void> => {
    setIsRegistering(true);
    setError(null);

    try {
      const token = getCookie('token');
      if (!token) {
        setError('Not logged in');
        return;
      }

      const result = await passkeyManager.register(token, getDeviceName());

      if (result.success) {
        onSetupComplete();
      } else {
        setError(result.error || 'Failed to set up passkey');
      }
    } catch (err) {
      console.error('Passkey registration failed:', err);
      if (err instanceof Error) {
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
      }
      if (typeof err === 'object' && err !== null) {
        console.error('Error details:', JSON.stringify(err, null, 2));
      }
      setError(
        'Failed to set up passkey. Check the browser console for details. ' +
        (err instanceof Error ? err.message : 'Unknown error')
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isSupported) {
    return <></>;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        <FingerprintIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Set Up Passkey
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Make signing in faster and more secure with a passkey.
          You&apos;ll use your fingerprint, face, or device PIN instead of your password.
        </DialogContentText>
        <DialogContentText sx={{ mt: 2, fontSize: '0.875rem', color: 'text.secondary' }}>
          This passkey will be saved to: <strong>{getDeviceName()}</strong>
        </DialogContentText>
        {error && (
          <DialogContentText sx={{ mt: 2, color: 'error.main' }}>
            {error}
          </DialogContentText>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isRegistering}>
          Not Now
        </Button>
        <Button
          onClick={handleSetup}
          variant="contained"
          disabled={isRegistering}
          startIcon={<FingerprintIcon />}
        >
          {isRegistering ? 'Setting Up...' : 'Set Up Passkey'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
