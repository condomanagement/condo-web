import React, { useEffect, useState } from 'react';
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Icon,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemText,
  Select,
  TextField,
  Theme, Typography,
} from '@mui/material';
import { get as getCookie } from 'es-cookie';
import { useNavigate } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import { DatePicker, TimePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import {
  Amenity,
  Question,
  ReservationTime,
  UserManager,
} from 'condo-brain';
import Schedule from '@mui/icons-material/Schedule';
import EventAvailable from '@mui/icons-material/EventAvailable';
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

const addMinutes = (date: Date, min: number): Date => {
  const updatedDate = new Date(date);
  updatedDate.setMinutes(date.getMinutes() + min);
  return updatedDate;
};

const roundToMinuteInterval = (date: Date, interval: number): Date => {
  const time = (date.getHours() * 60) + date.getMinutes();
  const rounded = Math.round(time / interval) * interval;
  const roundedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    Math.floor(rounded / 60),
    rounded % 60,
  );
  return roundedDate;
};

const formatDate = (date: Date): string => {
  let month = date.toLocaleDateString().split('/')[0];
  let day = date.toLocaleDateString().split('/')[1];
  const year = date.toLocaleDateString().split('/')[2];

  if (parseInt(month, 10) < 10) {
    month = `0${month}`;
  }
  if (parseInt(day, 10) < 10) {
    day = `0${day}`;
  }

  return `${year}-${month}-${day}`;
};

const formatTime = (date: Date): string => {
  const options = { hour12: false, hour: '2-digit', minute: '2-digit' } as const;
  return date.toLocaleTimeString([], options);
};

export default function Resevation(): JSX.Element {
  const [selectedStartDate, setSelectedStartDateChange] = useState<Date>(roundToMinuteInterval(new Date(), 15));
  const [selectedEndDate, setSelectedEndDateChange] = useState<Date>(addMinutes(selectedStartDate, 30));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [amenity, setAmenity] = useState<string | unknown>(null);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [displayAmenities, setDisplayAmenities] = useState<Amenity[]>([]);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [questions, setQuestions] = useState<{ [id: number]: Question[] } >([]);
  const [thanks, setThanks] = useState(false);
  const [amenityTime, setAmenityTime] = useState<number>(60);
  const [errorMessage, setErrorMessage] = useState<string | unknown>(null);
  const [availability, setAvailability] = useState<JSX.Element | null>(null);
  const [selectedAmenityName, setSelectedAmenityName] = useState<string | unknown>('');
  const [auth, setAuth] = useState(false);
  const [vaccinated, setVaccinated] = useState(false);

  const userManager = new UserManager();
  const navigate = useNavigate();

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
          setSelectedStartDateChange(new Date());
          setSelectedEndDateChange(new Date());
          setAmenity(null);
          setAnswers([]);
          setErrorMessage(null);
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
    const filteredAmenities = result.filter((filterAmenity) => (
      filterAmenity.visible
    ));
    setAmenities(filteredAmenities);
    const amenityQuestions: { [id: number]: Question[] } = [];
    Object.keys(filteredAmenities).forEach((i) => {
      const a = filteredAmenities[Number(i)];
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
            No current bookings.
            <p>
              {minutesToReadable(amenityTime)}
              {'  '}
              limit.
            </p>
          </>,
        );
      } else {
        // eslint-disable-next-line
        result.sort((r1: ReservationTime, r2: ReservationTime) => r1.startTime < r2.startTime ? -1 : 1);
        const times: string[] = [];
        const dateToShow = moment(selectedStartDate).local().format('YYYY-MM-DD');
        Object.keys(result).forEach((a) => {
          const pos = Number(a);
          const resultStartDate = moment(result[pos].startTime).local().format('YYYY-MM-DD');
          if (resultStartDate !== dateToShow) {
            return;
          }
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
                <ListItem style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <ListItemText
                    style={{ marginBottom: 0, marginTop: 0 }}
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

  const filterVaccinatedAmenities = (): void => {
    if (auth && !vaccinated) {
      const filteredAmenities: Array<Amenity> = amenities.filter((filterAmenity) => (
        !filterAmenity.vaccine
      ));
      setDisplayAmenities(filteredAmenities);
    } else {
      setDisplayAmenities(amenities);
    }
  };

  const checkLogin = (): void => {
    const token = getCookie('token');
    if (token) {
      userManager.validateToken(token).then((_result) => {
        if (userManager.loggedIn) {
          setAuth(true);
          setVaccinated(userManager.isVaccinated);
        } else {
          setAuth(false);
        }
      });
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, [amenities.length]);

  useEffect(() => {
    filterVaccinatedAmenities();
  }, [amenities.length, auth]);

  useEffect(() => {
    findReservations();
  }, [amenity, selectedStartDate]);

  useEffect(() => {
    if (!userManager) { return; }
    checkLogin();
    const timer = setTimeout(() => {
      checkLogin();
      clearTimeout(timer);
    }, 1000);
  }, [auth]);

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
    const constDate = new Date(date);
    const tzo = new Date().getTimezoneOffset();
    const changedDate = moment(constDate).add(tzo, 'm').toDate();
    const startDate = new Date(
      changedDate.getFullYear(),
      changedDate.getMonth(),
      changedDate.getDate(),
      selectedStartDate?.getHours() || new Date().getHours(),
      selectedStartDate?.getMinutes() || new Date().getMinutes(),
    );
    setSelectedStartDateChange(startDate);

    const endDate = new Date(
      changedDate.getFullYear(),
      changedDate.getMonth(),
      changedDate.getDate(),
      selectedEndDate?.getHours() || new Date().getHours(),
      selectedEndDate?.getMinutes() || new Date().getMinutes(),
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

    setSelectedStartDateChange(roundToMinuteInterval(startDate, 15));
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

    setSelectedStartDateChange(roundToMinuteInterval(startDate, 15));
  };

  const handleNativeEndTimeChange = (date: string): void => {
    const [hour, minute] = date.split(':');
    const endDate = new Date(
      selectedEndDate?.getFullYear() || new Date().getFullYear(),
      selectedEndDate?.getMonth() || new Date().getMonth(),
      selectedEndDate?.getDate() || new Date().getDate(),
      Number(hour),
      Number(minute),
    );

    setSelectedEndDateChange(roundToMinuteInterval(endDate, 15));
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

    setSelectedEndDateChange(roundToMinuteInterval(endDate, 15));
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
          <Grid container spacing={1}>
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
            <Grid item xs={12} className="center">
              <Button
                variant="contained"
                className={classes.registerButton}
                onClick={(): void => {
                  setAvailability(null);
                  setThanks(false);
                  setSelectedStartDateChange(roundToMinuteInterval(new Date(), 15));
                  setSelectedEndDateChange(roundToMinuteInterval(addMinutes(selectedStartDate, 30), 15));
                }}
                startIcon={<EventAvailable />}
                type="submit"
              >
                Make Another Reservation
              </Button>
            </Grid>
            <Grid item xs={12} className="center">
              <Button
                variant="contained"
                onClick={(): void => navigate('/myreservations')}
                className={classes.registerButton}
                startIcon={<Schedule />}
                type="submit"
              >
                My Reservations
              </Button>
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
                { auth && !vaccinated && (
                  <Alert severity="error">
                    <AlertTitle>Some Amenities Are Unavailable</AlertTitle>
                    Please submit your vaccine information to property management to
                    access all amenities.
                  </Alert>
                )}
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                    {displayAmenities.map(
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
                      defaultValue={formatDate(selectedStartDate)}
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
                      value={formatTime(roundToMinuteInterval(selectedStartDate, 15))}
                      onChange={(e): void => handleNativeStartTimeChange(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  { !isMobile && (
                    <TimePicker
                      id="startTime"
                      value={roundToMinuteInterval(selectedStartDate, 15)}
                      label="Start Time"
                      onChange={(e): void => handleStartDateChange(e?.toString())}
                      style={{ width: '100%' }}
                      minutesStep={15}
                    />
                  )}
                </Grid>
                <Grid item xs={6}>
                  { isMobile && (
                    <TextField
                      id="endTime"
                      label="End Time"
                      type="time"
                      value={formatTime(roundToMinuteInterval(selectedEndDate, 15))}
                      onChange={(e): void => handleNativeEndTimeChange(e.target.value)}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  )}
                  { !isMobile && (
                    <TimePicker
                      id="endTime"
                      value={roundToMinuteInterval(selectedEndDate, 15)}
                      label="End Time"
                      onChange={(e): void => handleEndDateChange(e?.toString())}
                      style={{ width: '100%' }}
                      minutesStep={15}
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
                <Grid item xs={12}>
                  <Typography>
                    Please ensure that you follow the posted instructions as well as complying with the
                    {' '}
                    <Link href="https://wscc556.frontsteps.com/folders/" target="_blank" rel="noopener">
                      Arrow Lofts condo rules
                    </Link>
                    .
                  </Typography>
                </Grid>
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
              </LocalizationProvider>
            </Grid>
          </div>
        </form>
      )}
    </div>
  );
}
