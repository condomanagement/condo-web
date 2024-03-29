import React, { useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Grid,
  Icon,
  TextField, Theme,
} from '@mui/material';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { UserManager } from 'condo-brain';
import './styles/application.scss';
import './styles/parking.scss';

export default function Parking({ userManager }: { userManager: UserManager }): JSX.Element {
  const [selectedStartDate, handleStartDateChange] = useState<Date | null>(new Date());
  const [selectedEndDate, handleEndDateChange] = useState<Date | null>(new Date());
  const [license, setLicense] = useState<string | unknown>('');
  const [unit, setUnit] = useState<string | unknown>(userManager.unit);
  const [make, setMake] = useState<string | unknown>('');
  const [color, setColor] = useState<string | unknown>('');
  const [email, setEmail] = useState<string | unknown>(userManager.email);
  const [thanks, setThanks] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  interface StyleProps {
    backgroundColor: string;
  }


  const useStyles = makeStyles((theme: Theme) => createStyles({
    root: {
      '& .MuiTextField-root': {
        margin: theme.spacing(1),
        width: '100%',
      },
    },
  }));

  const styleProps: StyleProps = { backgroundColor: '#f37f30' };
  const classes = useStyles(styleProps);

  const handleNativeStartDateChange = (date: string): void => {
    const startDate = new Date(`${date}T01:00:00-05:00`);
    handleStartDateChange(startDate);
  };

  const handleNativeEndDateChange = (date: string): void => {
    const endDate = new Date(`${date}T01:00:00-05:00`);
    handleEndDateChange(endDate);
  };

  const register = (e: React.FormEvent): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('parking[start_date]', String(selectedStartDate));
    formData.append('parking[end_date]', String(selectedEndDate));
    formData.append('parking[license]', String(license));
    formData.append('parking[unit]', String(unit));
    formData.append('parking[make]', String(make));
    formData.append('parking[color]', String(color));
    formData.append('parking[contact]', String(email));
    userManager.visitorParking(formData)
      .then((response) => {
        if (response.success === true) {
          setThanks(true);
        } else if (response.error) {
          setErrorMessage(response.error);
        }
      });
  };

  return (
    <div>
      { thanks && (
        <div className="section flex-grow">
          <Grid container spacing={5}>
            <Grid item xs={12} className="center">
              <h4 className="center">Thank you</h4>
              <p className="center">
                Thank you!
                {'  '}
                <span role="img" aria-label="">🚙</span>
                The vehicle has been registered.
                If you receive a ticket in error please contact the property manager.
                {'  '}
              </p>
            </Grid>
          </Grid>
        </div>
      )}
      { !thanks && (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={register}>
          <div className="section flex-grow">
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <h4 className="center">Register a Vehicle</h4>
                { errorMessage !== '' && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="start"
                  label="Start Date"
                  type="date"
                  defaultValue={selectedStartDate}
                  onChange={(e): void => handleNativeStartDateChange(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="end"
                  label="End Date"
                  type="date"
                  defaultValue={selectedEndDate}
                  onChange={(e): void => handleNativeEndDateChange(e.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="license"
                  label="License Plate"
                  style={{ width: '100%' }}
                  value={license}
                  onChange={(e): void => setLicense(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="unit"
                  label="Unit Number"
                  style={{ width: '100%' }}
                  value={unit}
                  onChange={(e): void => setUnit(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="make"
                  label="Vehicle Make"
                  style={{ width: '100%' }}
                  value={make}
                  onChange={(e): void => setMake(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  id="color"
                  label="Vehicle Colour"
                  style={{ width: '100%' }}
                  value={color}
                  onChange={(e): void => setColor(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="email"
                  label="Email or Phone Number"
                  style={{ width: '100%' }}
                  value={email}
                  onChange={(e): void => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} className="center">
                <Button
                  variant="contained"
                  type="submit"
                  sx={{
                    backgroundColor: '#f37f30',
                    color: 'white',
                    marginBottom: '20px',
                  }}
                  endIcon={<Icon>directions_car</Icon>}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </div>
        </form>
      )}
    </div>
  );
}
