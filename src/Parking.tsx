import React, { useState } from 'react';
import {
  Button,
  Grid,
  Icon,
  TextField,
  Theme,
} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns'; // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
import MaterialUtils from '@date-io/moment';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import './styles/application.scss';
import './styles/parking.scss';

export default function Parking(): JSX.Element {
  const [selectedStartDate, handleStartDateChange] = useState<Date | null>(new Date());
  const [selectedEndDate, handleEndDateChange] = useState<Date | null>(new Date());

  interface StyleProps {
    backgroundColor: string;
  }


  // eslint-disable-next-line max-len
  /* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars, arrow-parens, @typescript-eslint/explicit-function-return-type */
  const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
    registerButton: props => ({
      backgroundColor: '#f37f30',
      color: 'white',
      marginBottom: '20px',
    }),
  }));
  // eslint-disable-next-line max-len
  /* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type */

  const styleProps: StyleProps = { backgroundColor: '#f37f30' };
  const classes = useStyles(styleProps);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Register a Vehicle</h4>
        </Grid>
        <MuiPickersUtilsProvider utils={MaterialUtils}>
          <Grid item xs={6}>
            <DatePicker
              id="start"
              value={selectedStartDate}
              label="Start Date"
              onChange={handleStartDateChange}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              id="end"
              value={selectedEndDate}
              label="End Date"
              onChange={handleEndDateChange}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField id="license" label="License Plate" style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={6}>
            <TextField id="unit" label="Unit Number" style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={6}>
            <TextField id="make" label="Vehicle Make" style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={6}>
            <TextField id="color" label="Vehicle Colour" style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12}>
            <TextField id="email" label="Email or Phone Number" style={{ width: '100%' }} />
          </Grid>
          <Grid item xs={12} className="center">
            <Button
              variant="contained"
              className={classes.registerButton}
              endIcon={<Icon>directions_car</Icon>}
            >
              Register
            </Button>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
    </div>
  );
}
