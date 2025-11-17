import { PasskeyManager } from '@condomanagement/condo-brain';
import CloseIcon from '@mui/icons-material/Close';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { get as getCookie } from 'es-cookie';
import React, { useEffect, useState } from 'react';
import { getDeviceName, isPlatformAuthenticatorAvailable } from './utils/passkey';

interface PasskeySetupPromptProps {
  onSetupComplete: () => void;
}

export default function PasskeySetupPrompt({
  onSetupComplete,
}: PasskeySetupPromptProps): React.ReactElement {
  const [isSupported, setIsSupported] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const passkeyManager = new PasskeyManager();

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

      const result = await passkeyManager.register(getDeviceName());

      if (result.success) {
        onSetupComplete();
      } else {
        setError(result.error || 'Failed to set up passkey');
      }
    } catch (err) {
      console.error('Passkey registration failed:', err);
      setError(
        err instanceof Error ? err.message : 'Failed to set up passkey'
      );
    } finally {
      setIsRegistering(false);
    }
  };

  if (!isSupported) {
    return <></>;
  }

  return (
    <Alert
      severity="info"
      icon={<FingerprintIcon />}
      sx={{ mb: 2 }}
      action={
        <>
          <Button
            color="inherit"
            size="small"
            onClick={handleSetup}
            disabled={isRegistering}
            startIcon={<FingerprintIcon />}
          >
            {isRegistering ? 'Setting Up...' : 'Set Up'}
          </Button>
          <IconButton
            size="small"
            color="inherit"
            onClick={onSetupComplete}
            disabled={isRegistering}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </>
      }
    >
      <strong>Make login easier!</strong> Set up a passkey to sign in with your fingerprint, face, or device PIN.
      {error && <div style={{ marginTop: 8, color: 'error.main' }}>{error}</div>}
    </Alert>
  );
}
