import { UserManager, PasskeyManager } from '@condomanagement/condo-brain';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Alert, AlertTitle } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Icon from '@mui/material/Icon';
import TextField from '@mui/material/TextField';
import { set as setCookie } from 'es-cookie';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { isPlatformAuthenticatorAvailable } from './utils/passkey';

export default function Login({ userManager }: { userManager: UserManager }): React.ReactElement {
  const [processLogin, setProcessLogin] = React.useState<null | true>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<null | string>(null);
  const [passkeySupported, setPasskeySupported] = React.useState(false);
  const [passkeyAvailable, setPasskeyAvailable] = React.useState(false);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const navigate = useNavigate();
  const passkeyManager = new PasskeyManager();

  React.useEffect(() => {
    isPlatformAuthenticatorAvailable().then(setPasskeySupported);
  }, []);

  React.useEffect(() => {
    if (email && passkeySupported) {
      passkeyManager.checkAvailability(email).then((result: { passkeys_available: boolean }) => {
        setPasskeyAvailable(result.passkeys_available);
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, passkeySupported]);

  function doLogin(e: React.FormEvent): void {
    e.preventDefault();
    if (email && userManager) {
      setProcessLogin(true);
      userManager.login(email).then((result) => {
        if (result === false) {
          setError(
            'Invalid email address. Please use the same email address you use with Condo Control Central.',
          );
        }
      });
    }
  }

  async function doPasskeyLogin(): Promise<void> {
    setIsAuthenticating(true);
    setError(null);

    try {
      const result = await passkeyManager.authenticate();

      if (result.success && result.token) {
        setCookie('token', result.token);
        navigate('/');
        window.location.reload(); // Force reload to update Nav state
      } else {
        setError(result.error || 'Passkey authentication failed. Please try email login.');
      }
    } catch (err) {
      console.error('Passkey authentication failed:', err);
      setError('Passkey authentication failed. Please try email login.');
    } finally {
      setIsAuthenticating(false);
    }
  }

  const loginFrom = (
    <form noValidate autoComplete="off" onSubmit={(e): void => doLogin(e)}>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12 }}>
          <h4 className="center">Login</h4>
        </Grid>

        {passkeySupported && (
          <>
            <Grid size={{ xs: 12 }} className="center">
              <Button
                variant="contained"
                onClick={doPasskeyLogin}
                disabled={isAuthenticating}
                startIcon={<FingerprintIcon />}
                sx={{
                  backgroundColor: '#f37f30',
                  color: 'white',
                  marginBottom: '20px',
                }}
              >
                {isAuthenticating ? 'Authenticating...' : 'Sign in with Passkey'}
              </Button>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Divider>OR</Divider>
            </Grid>
          </>
        )}

        <Grid size={{ xs: 12 }}>
          <TextField
            id="email"
            label="Email address used with Condo Control Central"
            value={email || ''}
            onChange={(event): void => setEmail(event.target.value)}
            sx={{
              width: '100%',
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }} className="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f37f30',
              color: 'white',
              marginBottom: '20px',
            }}
            startIcon={<Icon>mail</Icon>}
            type="submit"
          >
            Send Login Link
          </Button>
        </Grid>
      </Grid>
    </form>
  );

  const loggingIn = (
    <Grid container spacing={5}>
      <Grid size={{ xs: 12 }}>
        <h4 className="center">
          {error && (<>Error</>)}
          {!error && (<>Check your Email</>)}
        </h4>
      </Grid>
      <Grid size={{ xs: 12 }} className="center">
        {error && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {error}
          </Alert>
        )}
        <p>
          If your email address matches one in our system you will receive a login link.
          Please check your email to continue.
        </p>
      </Grid>
    </Grid>
  );

  let loginDisplay;

  if (processLogin) {
    loginDisplay = loggingIn;
  } else {
    loginDisplay = loginFrom;
  }

  return (
    <div>
      {loginDisplay}
    </div>
  );
}
