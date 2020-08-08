import React from 'react';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
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
  const [email, setEmail] = React.useState<null | string>(null);

  function doLogin(): void {
    if (email && userManager) {
      userManager.login(email);
      setProcessLogin(true);
    }
  }

  const loginFrom = (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={doLogin}>
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
        <h4 className="center">Email Sent</h4>
      </Grid>
      <Grid item xs={12}>
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
