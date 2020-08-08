import React from 'react';
import Grid from '@material-ui/core/Grid';
import { useLocation, useNavigate } from 'react-router-dom';
import { UserManager } from 'condo-brain';

export default function Authenticate({ userManager }: { userManager: UserManager }): JSX.Element {
  const location = useLocation();
  const emailKey = location.pathname.split('/')[2];
  const [loginDisplay, setLoginDisplay] = React.useState<null | JSX.Element>(null);
  const navigate = useNavigate();

  const proccessing = (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <h4 className="center">Validating Account</h4>
      </Grid>
      <Grid item xs={12}>
        <p>Validating your account</p>
      </Grid>
    </Grid>
  );

  const loginError = (
    <Grid container spacing={5}>
      <Grid item xs={12}>
        <h4 className="center">Error</h4>
      </Grid>
      <Grid item xs={12}>
        <p>
          There was an error processing this login. Either it has already been used or there is another problem.
        </p>
      </Grid>
    </Grid>
  );


  const checkToken = async (): Promise<void> => {
    if (!userManager) { return; }
    userManager.processLogin(emailKey).then((result: boolean | string) => {
      if (!result) {
        setLoginDisplay(loginError);
      } else {
        navigate('/');
      }
    });
  };

  React.useEffect(() => {
    setLoginDisplay(proccessing);
    checkToken();
  }, [emailKey]);

  return (
    <div>
      {loginDisplay}
    </div>
  );
}
