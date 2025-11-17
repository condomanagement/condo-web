import { UserManager, UserType } from '@condomanagement/condo-brain';
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Icon,
  InputLabel,
  Link,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import './styles/application.scss';
import './styles/parking.scss';

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

export default function ElevatorBooking({ userManager }: { userManager: UserManager }): React.ReactElement {
  const [selectedStartDate, setSelectedStartDateChange] = useState<Date>(roundToMinuteInterval(new Date(), 15));
  const [selectedEndDate, setSelectedEndDateChange] = useState<Date>(addMinutes(selectedStartDate, 30));
  const [thanks, setThanks] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [moveType, setMoveType] = useState(0);
  const [name1, setName1] = useState<string | unknown>(userManager.fullname);
  const [name2, setName2] = useState<string | unknown>(null);
  const [phoneDay, setPhoneDay] = useState<string | unknown>(userManager.phone);
  const [phoneNight, setPhoneNight] = useState<string | unknown>(null);
  const [deposit, setDeposit] = useState(0);
  const [unit, setUnit] = useState<number | unknown>(userManager.unit);
  const [moveIn, setIn] = useState<boolean>(false);
  const [moveOut, setOut] = useState<boolean>(false);
  const [inText, setInText] = useState('Delivery');
  const [outText, setOutText] = useState('Disposal');

  const reserve = (e: React.FormEvent): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('elevator_booking[start]', String(selectedStartDate));
    formData.append('elevator_booking[end]', String(selectedEndDate));
    formData.append('elevator_booking[moveType]', String(moveType));
    if (name1) {
      formData.append('elevator_booking[name1]', String(name1));
    }

    if (name2) {
      formData.append('elevator_booking[name2]', String(name2));
    }

    if (phoneDay) {
      formData.append('elevator_booking[phone_day]', String(phoneDay));
    }
    if (phoneNight) {
      formData.append('elevator_booking[phone_night]', String(phoneNight));
    }
    if (unit) {
      formData.append('elevator_booking[unit]', String(unit));
    }
    formData.append('elevator_booking[in]', String(moveIn));
    formData.append('elevator_booking[out]', String(moveOut));
    formData.append('elevator_booking[deposit]', String(deposit));
    userManager.createElevatorBooking(formData)
      .then((response) => {
        if (response.success === true) {
          setThanks(true);
          setSelectedStartDateChange(new Date());
          setSelectedEndDateChange(new Date());
          setErrorMessage('');
        } else if (response.error === 'Unprocessable Entity') {
          const err = 'Please make sure you have filled out the form correctly.';
          setErrorMessage(err);
        } else if (response.error) {
          setErrorMessage(response.error);
        }
      });
  };

  const computeDeposit = (mt: number, sd: Date, ed: Date): void => {
    const fees = {
      deposit: 500,
      weekday: {
        cost: 200,
        extra: 50,
      },
      weekend: {
        cost: 300,
        extra: 75,
      },
    };

    if (mt === 2) {
      let numberOfHours = Math.ceil(((ed.getTime() - sd.getTime()) / 1000) / 60 / 60);
      if (numberOfHours < 4) {
        numberOfHours = 4;
      }

      if (ed.getDay() === 6) {
        const dep = fees.deposit + fees.weekend.cost + (fees.weekend.extra * (numberOfHours - 4));
        setDeposit(dep);
      } else {
        const dep = fees.deposit + fees.weekday.cost + (fees.weekday.extra * (numberOfHours - 4));
        setDeposit(dep);
      }
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
    computeDeposit(moveType, startDate, endDate);
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

    const roundedStart = roundToMinuteInterval(startDate, 15);
    setSelectedStartDateChange(roundedStart);
    computeDeposit(moveType, roundedStart, selectedEndDate);
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

    const roundedEnd = roundToMinuteInterval(endDate, 15);
    setSelectedEndDateChange(roundedEnd);
    computeDeposit(moveType, selectedStartDate, roundedEnd);
  };

  const handleIn = (event: React.ChangeEvent<{ name?: string; checked: unknown }>): void => {
    if (event.target.checked) {
      setIn(true);
    } else {
      setIn(false);
    }
  };

  const handleOut = (event: React.ChangeEvent<{ name?: string; checked: unknown }>): void => {
    if (event.target.checked) {
      setOut(true);
    } else {
      setOut(false);
    }
  };

  const handleTypeChange = (event: SelectChangeEvent<string>): void => {
    setMoveType(Number(event.target.value));
    if (event.target.value === '1') {
      setDeposit(0);
      setInText('Delivery');
      setOutText('Disposal');
    } else if (event.target.value === '2') {
      setInText('Move in');
      setOutText('Move out');
      computeDeposit(Number(event.target.value), selectedStartDate, selectedEndDate);
    }
  };

  useEffect(() => {
    if (userManager.userType !== UserType.Owner) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMoveType(1);
    }
  }, [userManager]);

  return (
    <div>
      { thanks && (
        <div className="section flex-grow">
          <Grid container spacing={1}>
            <Grid size={{ xs: 12 }}>
              <h4 className="center">Elevator Reservation Submitted</h4>
              <p className="center">
                Thank you!
                {'  '}
                You will recieve an email when we confirm your elevator reservation or if we have
                additional questions.
                {'  '}
              </p>
            </Grid>
          </Grid>
        </div>
      )}
      { !thanks && (
        <form noValidate autoComplete="off" onSubmit={reserve}>
          <div className="section flex-grow">
            <Grid container spacing={5}>
              <Grid size={{ xs: 12 }}>
                <h4 className="center">Reserve Elevator</h4>
                <Alert severity="info">
                  <AlertTitle>Available hours</AlertTitle>
                  <p>
                    <strong>
                      Moving
                    </strong>
                  </p>
                  <p>
                    Elevator booking hours are Monday to Friday 9 AM - 5 PM and Saturdays 9 AM - 3 PM for moving.
                    Only owners can book the elevator for moves. If you are a tenant please contact your landlord.
                  </p>
                  <p>
                    <strong>
                      Deliveries & Disposals
                    </strong>
                  </p>
                  <p>
                    Elevator booking hours are Monday to Friday 9 AM - 3 PM and Saturdays 9 AM - 12 PM for deliveries
                    and disposals.
                    There is one delivery space available for each morning and afternoon.
                  </p>
                  <p>
                    <strong>
                      Elevators are not available to book on Sundays or statutory holidays.
                    </strong>
                  </p>
                  <p />
                </Alert>
                { errorMessage !== '' && (
                  <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {errorMessage}
                  </Alert>
                )}
              </Grid>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid size={{ xs: 6 }}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="moveType">Type</InputLabel>
                    <Select
                      native
                      value={String(moveType)}
                      onChange={handleTypeChange}
                      inputProps={{
                        name: 'moveType',
                        id: 'moveType',
                      }}
                      label="Type"
                    >
                      <option aria-label="None" value="" />
                      <option key="delivery" value="1">Delivery / Disposal</option>
                      {userManager.userType === UserType.Owner && (
                        <option key="move" value="2">Move</option>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="start"
                    label="Date"
                    type="date"
                    defaultValue={formatDate(selectedStartDate)}
                    onChange={(e): void => handleNativeDateChange(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="startTime"
                    label="Start Time"
                    type="time"
                    value={formatTime(roundToMinuteInterval(selectedStartDate, 15))}
                    onChange={(e): void => handleNativeStartTimeChange(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="endTime"
                    label="End Time"
                    type="time"
                    value={formatTime(roundToMinuteInterval(selectedEndDate, 15))}
                    onChange={(e): void => handleNativeEndTimeChange(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    fullWidth
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="name1"
                    label="Resident 1"
                    fullWidth
                    value={name1 || ''}
                    onChange={(e): void => setName1(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="name2"
                    label="Resident 2 (if applicable)"
                    fullWidth
                    value={name2 || ''}
                    onChange={(e): void => setName2(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="phoneDay"
                    label="Daytime number"
                    fullWidth
                    value={phoneDay || ''}
                    onChange={(e): void => setPhoneDay(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="phoneNight"
                    label="Evening number"
                    fullWidth
                    value={phoneNight || ''}
                    onChange={(e): void => setPhoneNight(e.target.value)}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <TextField
                    id="unit"
                    label="Unit"
                    fullWidth
                    value={unit || ''}
                    onChange={(e): void => setUnit(Number(e.target.value))}
                  />
                </Grid>
                <Grid size={{ xs: 6 }}>
                  {moveType !== 0 && (
                    <div>
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={moveIn}
                            onChange={handleIn}
                            name={inText}
                            color="primary"
                          />
                        )}
                        label={inText}
                      />
                      <FormControlLabel
                        control={(
                          <Checkbox
                            checked={moveOut}
                            onChange={handleOut}
                            name={outText}
                            color="primary"
                          />
                        )}
                        label={outText}
                      />
                    </div>
                  )}
                </Grid>
                {moveType === 2 && (
                  <Grid size={{ xs: 12 }}>
                    <Alert severity="warning">
                      <AlertTitle>
                        You will be contacted for the below moving fee
                      </AlertTitle>
                      <ul>
                        <li> $500 refundable deposit</li>
                        <li> Non-refundable fee (up to 4 hours):</li>
                        <ul>
                          <li>$200 weekday + $50 / hour over 4 hours</li>
                          <li>$300 Saturday + $75 / hour over 4 hours</li>
                        </ul>
                      </ul>
                      <p>
                        Deposit
                        {' '}
                        $500
                        <br />
                        Fee
                        {' '}
                        $
                        {deposit - 500}
                        <br />
                        <strong>
                          Total due: $
                          {deposit}
                        </strong>
                      </p>
                    </Alert>
                  </Grid>
                )}
                <Grid size={{ xs: 12 }}>
                  <Typography>
                    Please ensure that you follow the posted instructions as well as complying with the
                    {' '}
                    <Link href="https://wscc556.frontsteps.com/folders/" target="_blank" rel="noopener">
                      Arrow Lofts condo rules
                    </Link>
                    .
                  </Typography>
                </Grid>
                {moveType !== 0 && (
                  <Grid size={{ xs: 12 }} className="center">
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{
                        backgroundColor: '#f37f30',
                        color: 'white',
                        marginBottom: '20px',
                      }}
                      endIcon={<Icon>add</Icon>}
                    >
                      Reserve Elevator
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
