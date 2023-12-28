import React from 'react';
import {
  Button,
  Grid,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LocalParking from '@mui/icons-material/LocalParking';
import HomeIcon from '@mui/icons-material/Home';
import './styles/application.scss';
import './styles/parking.scss';

export default function Home(): JSX.Element {
  const navigate = useNavigate();

  return (
    <div className="section flex-grow center">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f37f30',
              color: 'white',
              marginBottom: '20px',
            }}
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
            sx={{
              backgroundColor: '#f37f30',
              color: 'white',
              marginBottom: '20px',
            }}
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
