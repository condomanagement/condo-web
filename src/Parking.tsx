import Grid from '@mui/material/Grid';
import React from 'react';
import './styles/application.scss';

const PARKING_REDIRECT_URL = 'https://app.condocontrol.com/visitor/my-visit';

export default function Parking(): React.ReactElement {
  React.useEffect(() => {
    window.location.replace(PARKING_REDIRECT_URL);
  }, []);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid size={{ xs: 12 }} className="center">
          <p className="center">
            Redirecting to visitor parking registration…
            {' '}
            If you are not redirected automatically,
            {' '}
            <a href={PARKING_REDIRECT_URL}>click here</a>
            .
          </p>
        </Grid>
      </Grid>
    </div>
  );
}
