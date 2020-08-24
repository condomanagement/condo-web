import React, { useEffect, useState } from 'react';
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  Select,
  TextField,
  Theme,
} from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import MomentUtils from '@date-io/moment';
import { isMobile } from 'react-device-detect';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { DatePicker, MuiPickersUtilsProvider, TimePicker } from '@material-ui/pickers';
import { Amenity, Question, UserManager } from 'condo-brain';
import moment from 'moment';
import './styles/application.scss';
import './styles/parking.scss';

const minutesToReadable = (t: number): string => {
  const hours = Math.floor(t / 60);
  const hourText = hours > 1 ? 'hours' : 'hour';

  const minutes = t % 60;

  let timeText = '';
  if (hours > 0) {
    timeText = `${hours} ${hourText} `;
  }

  if (minutes > 0) {
    timeText = `${timeText} ${minutes} minutes`;
  }
  return timeText;
};

export default function Resevation(): JSX.Element {
  const [selectedStartDate, setSelectedStartDateChange] = useState<Date | null>(new Date());
  const [selectedEndDate, setSelectedEndDateChange] = useState<Date | null>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [amenity, setAmenity] = useState<string | unknown>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<{ [id: number]: Question[] } >([]);
  const [thanks, setThanks] = useState(false);
  const [amenityTime, setAmenityTime] = useState<number>(60);
  const [errorMessage, setErrorMessage] = useState<string | unknown>(null);
  const [availability, setAvailability] = useState<JSX.Element | null>(null);
  const [selectedAmenityName, setSelectedAmenityName] = useState<string | unknown>('');

  const userManager = new UserManager();

  const reserve = (e: React.FormEvent): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('reservation[resource_id]', String(amenity));
    formData.append('reservation[start_time]', String(selectedStartDate));
    formData.append('reservation[end_time]', String(selectedEndDate));
    formData.append('answers[]', JSON.stringify(answers));
    userManager.createReservation(formData)
      .then((response) => {
        if (response.success === true) {
          setThanks(true);
        } else if (response.error === 'Unprocessable Entity') {
          const err = 'Please make sure you have filled out the form correctly. '
            + 'If you could not check every box, then you cannot use this amenity.';
          setErrorMessage(err);
        } else {
          setErrorMessage(response.error);
        }
      });
  };

  const fetchAmenities = async (): Promise<void> => (userManager.getAmenities().then((result) => {
    setAmenities(result);
    const amenityQuestions: { [id: number]: Question[] } = [];
    Object.keys(result).forEach((i) => {
      const a = result[Number(i)];
      amenityQuestions[a.id] = a.questions;
    });
    setQuestions(amenityQuestions);
  }));

  const findReservations = (): void => {
    if (!amenity || !selectedStartDate) { return; }

    userManager.findReservations(selectedStartDate, Number(amenity)).then((result) => {
      if (result.length === 0) {
        setAvailability(
          <>
            <AlertTitle>
              {selectedAmenityName}
              {'  '}
              Availability
            </AlertTitle>
            Available all day.
            <p>
              {minutesToReadable(amenityTime)}
              {'  '}
              limit.
            </p>
          </>,
        );
      } else {
        const times: string[] = [];
        Object.keys(result).forEach((a) => {
          const pos = Number(a);
          times.push(`${moment(result[pos].startTime).format('LT')} - ${moment(result[pos].endTime).format('LT')}`);
        });
        setAvailability(
          <>
            <AlertTitle>
              {selectedAmenityName}
              {' '}
              has a
              {' '}
              <strong>
                {minutesToReadable(amenityTime)}
                {' '}
                limit
              </strong>
              ,
              {' '}
              and is already booked at these times:
            </AlertTitle>
            <List>
              {times.map((time) => (
                <ListItem>
                  <ListItemText
                    primary={time}
                  />
                </ListItem>
              ))}
            </List>
          </>,
        );
      }
    });
  };

  useEffect(() => {
    fetchAmenities();
  }, [amenities.length]);

  useEffect(() => {
    findReservations();
  }, [amenity, selectedStartDate]);

  const handleAmenityChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const reserveAmenity = event.target.value;
    setAmenity(reserveAmenity);
    Object.keys(amenities).forEach((a) => {
      const loopAmenity = amenities[Number(a)];
      if (String(loopAmenity.id) === event.target.value) {
        setSelectedAmenityName(loopAmenity.name);
        setAmenityTime(loopAmenity.timeLimit);
      }
    });
  };

  const handleAnswerChange = (event: React.ChangeEvent<{ name?: string; checked: unknown }>): void => {
    if (event.target.checked) {
      const currentAnswers = answers;
      currentAnswers[Number(event.target.name)] = true;
      setAnswers(currentAnswers);
    } else {
      const currentAnswers = answers;
      currentAnswers[Number(event.target.name)] = false;
      setAnswers(currentAnswers);
    }
  };

  const handleNativeDateChange = (date: string): void => {
    const changedDate = new Date(date);
    const startDate = new Date(
      changedDate.getFullYear(),
      changedDate.getMonth(),
      changedDate.getDate(),
      selectedStartDate?.getHours() || new Date().getHours(),
      selectedStartDate?.getMinutes() || new Date().getMinutes(),
      changedDate.getTimezoneOffset(),
    );
    setSelectedStartDateChange(startDate);

    const endDate = new Date(
      changedDate.getFullYear(),
      changedDate.getMonth(),
      changedDate.getDate(),
      selectedEndDate?.getHours() || new Date().getHours(),
      selectedEndDate?.getMinutes() || new Date().getMinutes(),
      changedDate.getTimezoneOffset(),
    );
    setSelectedEndDateChange(endDate);
  };

  const handleDateChange = (date: string | undefined): void => {
    let setDate = new Date();
    if (date) {
      setDate = new Date(date);
    }
    setSelectedDate(setDate);

    const startDate = new Date(
      setDate.getFullYear(),
      setDate.getMonth(),
      setDate.getDate(),
      selectedStartDate?.getHours(),
      selectedStartDate?.getMinutes(),
    );

    setSelectedStartDateChange(startDate);

    const endDate = new Date(
      setDate.getFullYear(),
      setDate.getMonth(),
      setDate.getDate(),
      selectedEndDate?.getHours() || new Date().getHours(),
      selectedEndDate?.getMinutes() || new Date().getMinutes(),
    );
    setSelectedEndDateChange(endDate);
  };

  const handleNativeStartTimeChange = (date: string): void => {
    const [hour, minute] = date.split(':');
    const startDate = new Date(
      selectedStartDate?.getFullYear() || new Date().getFullYear(),
      selectedStartDate?.getMonth() || new Date().getMonth(),
      selectedStartDate?.getDate() || new Date().getDate(),
      Number(hour),
      Number(minute),
    );

    setSelectedStartDateChange(startDate);
  };

  const handleStartDateChange = (date: string | undefined): void => {
    let setTime = new Date();
    if (date) {
      setTime = new Date(date);
    }

    const startDate = new Date(
      selectedDate?.getFullYear() || new Date().getFullYear(),
      selectedDate?.getMonth() || new Date().getMonth(),
      selectedDate?.getDate() || new Date().getDate(),
      setTime.getHours(),
      setTime.getMinutes(),
    );

    setSelectedStartDateChange(startDate);
  };

  const handleNativeEndTimeChange = (date: string): void => {
    const [hour, minute] = date.split(':');
    const changedDate = new Date();
    const endDate = new Date(
      selectedEndDate?.getFullYear() || new Date().getFullYear(),
      selectedEndDate?.getMonth() || new Date().getMonth(),
      selectedEndDate?.getDate() || new Date().getDate(),
      Number(hour),
      Number(minute),
      changedDate.getTimezoneOffset(),
    );

    setSelectedEndDateChange(endDate);
  };

  const handleEndDateChange = (date: string | undefined): void => {
    let setTime = new Date();
    if (date) {
      setTime = new Date(date);
    }

    const endDate = new Date(
      selectedDate?.getFullYear() || new Date().getFullYear(),
      selectedDate?.getMonth() || new Date().getMonth(),
      selectedDate?.getDate() || new Date().getDate(),
      setTime.getHours(),
      setTime.getMinutes(),
    );

    setSelectedEndDateChange(endDate);
  };

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
    paper: {
      position: 'absolute',
      width: 400,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }));

  const classes = useStyles();

  return (
    <div>
      { thanks && (
        <div className="section flex-grow">
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <h4 className="center">Amenity reserved</h4>
              <p className="center">
                Thank you!
                {'  '}
                <span role="img" aria-label="">🤟</span>
                Your reservation has been confirmed!
                {'  '}
              </p>
            </Grid>
          </Grid>
        </div>
      )}
      { !thanks && (
        <form className={classes.root} noValidate autoComplete="off" onSubmit={reserve}>
          <div className="section flex-grow">
            <Grid container spacing={5}>
              <Grid item xs={12}>
                <h4 className="center">Reserve an Amenity</h4>
                { errorMessage && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
              </Grid>
              <MuiPickersUtilsProvider utils={MomentUtils}>
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
                    {amenities.map(
                      (amenityOption: Amenity) => (
                        <option key={amenityOption.id} value={String(amenityOption.id)}>{amenityOption.name}</option>
                      ),
                    )}
                  </Select>
                </Grid>
                <Grid item xs={6}>
                  { isMobile && (
                    <TextField
                      id="start"
                      label="Date"
                      type="date"
                      defaultValue={selectedStartDate}
                      onChange={(e): void => handleNativeDateChange(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  { !isMobile && (
                    <DatePicker
                      id="start"
                      value={selectedStartDate}
                      label="Date"
                      onChange={(e): void => handleDateChange(e?.toString())}
                      style={{ width: '100%' }}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  { isMobile && (
                    <TextField
                      id="startTime"
                      label="Start Time"
                      type="time"
                      defaultValue={selectedStartDate}
                      onChange={(e): void => handleNativeStartTimeChange(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  { !isMobile && (
                    <TimePicker
                      id="startTime"
                      value={selectedStartDate}
                      label="Start Time"
                      onChange={(e): void => handleStartDateChange(e?.toString())}
                      style={{ width: '100%' }}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  { isMobile && (
                    <TextField
                      id="endTime"
                      label="End Time"
                      type="time"
                      defaultValue={selectedEndDate}
                      onChange={(e): void => handleNativeEndTimeChange(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  { !isMobile && (
                    <TimePicker
                      id="endTime"
                      value={selectedEndDate}
                      label="End Time"
                      onChange={(e): void => handleEndDateChange(e?.toString())}
                      style={{ width: '100%' }}
                    />
                  )}
                </Grid>
                { availability && (
                  <Grid item xs={12}>
                    <Alert severity="info">
                      {availability}
                    </Alert>
                  </Grid>
                )}
                {amenity && questions[Number(amenity)].map(
                  (questionOption) => (
                    <Grid item xs={12} key={questionOption.id}>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={answers[questionOption.id]}
                            onChange={handleAnswerChange}
                            name={String(questionOption.id)}
                            color="primary"
                          />
                        )}
                        label={questionOption.question}
                      />
                    </Grid>
                  ),
                )}
                {amenity && (
                  <Grid item xs={12} className="center">
                    <Button
                      variant="contained"
                      type="submit"
                      className={classes.registerButton}
                      endIcon={<Icon>add</Icon>}
                    >
                      Reserve
                      {selectedAmenityName && (
                        <>
                          {'  '}
                          {selectedAmenityName}
                        </>
                      )}
                    </Button>
                  </Grid>
                )}
              </MuiPickersUtilsProvider>
            </Grid>
          </div>
        </form>
      )}
    </div>
  );
}
