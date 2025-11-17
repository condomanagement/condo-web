import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import { get as getCookie } from 'es-cookie';
import React, { useEffect, useState } from 'react';
import { PasskeyManager } from '@condomanagement/condo-brain';

interface PasskeySetupBannerProps {
  passkeyManager: PasskeyManager;
  onSetupComplete: () => void;
}

export default function PasskeySetupBanner({
  passkeyManager,
  onSetupComplete
}: PasskeySetupBannerProps): React.ReactElement | null {
  const [show, setShow] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    const checkPasskeyStatus = async (): Promise<void> => {
      const supported = await PasskeyManager.isSupported();
      setIsSupported(supported);

      if (supported) {
        try {
          const credentials = await passkeyManager.list();
          setHasPasskey(credentials.length > 0);
        } catch {
          setHasPasskey(false);
        }
      }
    };

    checkPasskeyStatus();
  }, [passkeyManager]);

  useEffect(() => {
    setShow(isSupported && !hasPasskey);
  }, [isSupported, hasPasskey]);

  const handleSetupPasskey = async (): Promise<void> => {
    try {
      const token = getCookie('token');
      if (!token) {
        alert('Please log in to set up a passkey');
        return;
      }
      await passkeyManager.register(token, 'My Device');
      setShow(false);
      onSetupComplete();
    } catch (error) {
      console.error('Failed to set up passkey:', error);
      alert(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDismiss = (): void => {
    setShow(false);
  };

  if (!show) {
    return null;
  }

  return (
    <Snackbar
      open={show}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ mt: 8 }}
    >
      <Alert
        severity="info"
        onClose={handleDismiss}
        action={
          <Button color="inherit" size="small" onClick={handleSetupPasskey}>
            Set Up Now
          </Button>
        }
      >
        <strong>Make login easier!</strong> Set up a passkey to sign in with your fingerprint, face, or device PIN.
      </Alert>
    </Snackbar>
  );
}
