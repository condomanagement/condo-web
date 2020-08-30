import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import { Alert, AlertTitle } from '@material-ui/lab';
import { UserManager } from 'condo-brain';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  registerButton: {
    backgroundColor: '#f37f30',
    color: 'white',
    marginBottom: '20px',
  },
}));

export default function Login({ userManager }: { userManager: UserManager }): JSX.Element {
  const classes = useStyles();
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
            'Invalid email address. Please make sure you are using the same email address you use with FrontSteps.',
          );
        }
      });
    }
  }

  const loginFrom = (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={(e): void => doLogin(e)}>
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Login</h4>
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="email"
            label="Email address used with FrontSteps"
            value={email || ''}
            onChange={(event): void => setEmail(event.target.value)}
          />
        </Grid>
        <Grid item xs={12} className="center">
          <Button
            variant="contained"
            className={classes.registerButton}
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
          If your email address matches one in our system you will recieve a login link.
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
