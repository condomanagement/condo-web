import React, { useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  Select,
  Theme,
} from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import DateFnsUtils from '@date-io/date-fns'; // eslint-disable-line no-unused-vars, @typescript-eslint/no-unused-vars
import MaterialUtils from '@date-io/moment';
import { makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import './styles/application.scss';
import './styles/parking.scss';

export default function Resevation(): JSX.Element {
  const [selectedStartDate, handleStartDateChange] = useState<Date | null>(new Date());
  const [selectedEndDate, handleEndDateChange] = useState<Date | null>(new Date());
  const [amenity, setAmenity] = useState<string | unknown>(null);
  const [answers, setAnswers] = useState(false);
  const [openRegister, setOpenRegister] = React.useState(false);

  const handleOpenRegister = (): void => {
    setOpenRegister(true);
  };

  const handleCloseRegister = (): void => {
    setOpenRegister(false);
  };

  interface StyleProps {
    backgroundColor: string;
  }

  const handleAmenityChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    setAmenity(event.target.value);
  };

  const handleAnswerChange = (event: React.ChangeEvent<{ name?: string; checked: unknown }>): void => {
    if (event.target.checked) {
      setAnswers(true);
    } else {
      setAnswers(false);
    }
  };

  // eslint-disable-next-line max-len
  /* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars, arrow-parens, @typescript-eslint/explicit-function-return-type */
  const useStyles = makeStyles<Theme, StyleProps>((theme: Theme) => ({
    registerButton: props => ({
      backgroundColor: '#f37f30',
      color: 'white',
      marginBottom: '20px',
    }),
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));
  // eslint-disable-next-line max-len
  /* eslint-enable no-unused-vars, @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type */

  const styleProps: StyleProps = { backgroundColor: '#f37f30' };
  const classes = useStyles(styleProps);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Reserve an Amenity</h4>
        </Grid>
        <MuiPickersUtilsProvider utils={MaterialUtils}>
          <Grid item xs={6}>
            <InputLabel htmlFor="age-native-simple">Amenity</InputLabel>
            <Select
              native
              value={amenity}
              onChange={handleAmenityChange}
              inputProps={{
                name: 'amenity',
                id: 'amenity',
              }}
              style={{ width: '100%' }}
            >
              <option aria-label="None" value="" />
              <option value="Theater">Theatre</option>
              <option value="Treadmill">Treadmill</option>
              <option value="Weights">Weights</option>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <DatePicker
              id="start"
              value={selectedStartDate}
              label="Date"
              onChange={handleStartDateChange}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              id="startTime"
              value={selectedStartDate}
              label="Start Time"
              onChange={handleStartDateChange}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={6}>
            <TimePicker
              id="endTime"
              value={selectedEndDate}
              label="End Time"
              onChange={handleEndDateChange}
              style={{ width: '100%' }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={(
                <Checkbox
                  checked={answers}
                  onChange={handleAnswerChange}
                  name="checkedB"
                  color="primary"
                />
              )}
              label="I have not put myself or others in grave danger"
            />
          </Grid>
          <Grid item xs={12} className="center">
            <Button
              variant="contained"
              className={classes.registerButton}
              endIcon={<Icon>add</Icon>}
              onClick={handleOpenRegister}
            >
              Reserve
            </Button>
          </Grid>
        </MuiPickersUtilsProvider>
      </Grid>
      <Dialog
        open={openRegister}
        keepMounted
        onClose={handleCloseRegister}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title"><span role="img" aria-label="">🐴🐴🐴</span></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            Hold your horses! We are not done glueing this together.
            But do not worry, no horses will be hurt making this glue!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRegister} color="primary">
            <span role="img" aria-label="">🦄</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
