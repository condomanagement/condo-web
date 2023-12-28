import React from 'react';
import Button from '@mui/material/Button';
import Icon from '@mui/material/Icon';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Alert, AlertTitle } from '@mui/material';
import { UserManager } from 'condo-brain';

export default function Login({ userManager }: { userManager: UserManager }): JSX.Element {
  const [processLogin, setProcessLogin] = React.useState<null | true>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [email, setEmail] = React.useState<null | string>(null);

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

  const loginFrom = (
    <form noValidate autoComplete="off" onSubmit={(e): void => doLogin(e)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Login</h4>
        </Grid>
        <Grid item xs={12}>
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
        <Grid item xs={12} className="center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f37f30',
              color: 'white',
              marginBottom: '20px',
            }}
            endIcon={<Icon>mail</Icon>}
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
      <Grid item xs={12}>
        <h4 className="center">
          {error && (<>Error</>)}
          {!error && (<>Check your Email</>)}
        </h4>
      </Grid>
      <Grid item xs={12} className="center">
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
