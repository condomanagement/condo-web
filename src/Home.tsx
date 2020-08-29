import React from 'react';
import {
  Button,
  Grid,
} from '@material-ui/core';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { useNavigate } from 'react-router-dom';
import LocalParking from '@material-ui/icons/LocalParking';
import HomeIcon from '@material-ui/icons/Home';
import './styles/application.scss';
import './styles/parking.scss';

export default function Home(): JSX.Element {
  const useStyles = makeStyles(() => createStyles({
    registerButton: {
      backgroundColor: '#f37f30',
      color: 'white',
      marginBottom: '20px',
    },
  }));

  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <div className="section flex-grow center">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            className={classes.registerButton}
            onClick={(): void => navigate('/login')}
            startIcon={<HomeIcon />}
            type="submit"
          >
            Resident Login
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            onClick={(): void => navigate('/parking')}
            className={classes.registerButton}
            startIcon={<LocalParking />}
            type="submit"
          >
            Visitor Parking Registration
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
