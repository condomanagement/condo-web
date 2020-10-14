import React, { useEffect, useState } from 'react';
import { AdminManager, ElevatorBooking } from 'condo-brain';
import { Grid } from '@material-ui/core';
import {
  Theme,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Link from '@material-ui/core/Link';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import moment from 'moment';

const StyledTableCell = withStyles((theme: Theme) => createStyles({
  head: {
    backgroundColor: '#f37f30',
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme: Theme) => createStyles({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  table: {
    minWidth: 700,
  },
}));

export default function ElevatorBookingAdmin(): JSX.Element {
  const classes = useStyles();
  const [bookings, setBookings] = useState<ElevatorBooking[]>([]);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<ElevatorBooking | undefined>(undefined);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }

  const fetchBookings = async (): Promise<void> => {
    admin.getElevatorBookings().then((response) => {
      setBookings(response);
    });
  };

  const showBooking = (booking: ElevatorBooking): void => {
    setSelectedBooking(booking);
    setBookingOpen(true);
  };

  const approveBooking = (e: React.FormEvent): void => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('elevator_booking[approved]', 'true');
    if (selectedBooking?.id) {
      admin.approveElevatorBooking(selectedBooking.id, formData)
        .then((_response: boolean) => {
          fetchBookings();
          setBookingOpen(false);
        });
    }
  };

  const bookingType = (booking: ElevatorBooking): React.ReactNode => (
    <>
      {booking.moveType === 1 && booking.moveIn === true && booking.moveOut === true && (
        <div>
          Delivery & Disposal
        </div>
      )}
      {booking.moveType === 1 && booking.moveIn === true && booking.moveOut === false && (
        <div>
          Delivery
        </div>
      )}
      {booking.moveType === 1 && booking.moveIn === false && booking.moveOut === true && (
        <div>
          Disposal
        </div>
      )}
      {booking.moveType === 2 && booking.moveIn === true && booking.moveOut === true && (
        <div>
          Move in & out
        </div>
      )}
      {booking.moveType === 2 && booking.moveIn === true && booking.moveOut === false && (
        <div>
          Move in
        </div>
      )}
      {booking.moveType === 2 && booking.moveIn === false && booking.moveOut === true && (
        <div>
          Move out
        </div>
      )}
    </>
  );

  useEffect(() => {
    fetchBookings();
  }, [bookings.length]);


  const bookingPopup = (
    <Dialog open={bookingOpen} aria-labelledby="form-dialog-title" fullWidth>
      <DialogTitle id="form-dialog-title">
        <>
          {selectedBooking !== undefined && selectedBooking.approved === false && (
            <>
              Pending
              {' '}
            </>
          )}
          Booking Details
        </>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={5}>
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableBody>
                  <StyledTableRow key="bookedBy">
                    <StyledTableCell component="th" scope="row">
                      Booked by
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {selectedBooking?.user.name}
                      {' '}
                      (
                      {selectedBooking?.user.unit}
                      )
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key="name1">
                    <StyledTableCell component="th" scope="row">
                      Booking for
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {selectedBooking?.name1}
                      {' '}
                      (
                      {selectedBooking?.unit}
                      )
                    </StyledTableCell>
                  </StyledTableRow>
                  {selectedBooking?.name2 && (
                    <StyledTableRow key="bookedBy">
                      <StyledTableCell component="th" scope="row">
                        Booking for
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        {selectedBooking?.name2}
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                  <StyledTableRow key="type">
                    <StyledTableCell component="th" scope="row">
                      Reservation type
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {selectedBooking !== undefined && bookingType(selectedBooking)}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key="from">
                    <StyledTableCell component="th" scope="row">
                      Start
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {moment(selectedBooking?.startTime).format('llll')}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow key="end">
                    <StyledTableCell component="th" scope="row">
                      End
                    </StyledTableCell>
                    <StyledTableCell scope="row">
                      {moment(selectedBooking?.endTime).format('llll')}
                    </StyledTableCell>
                  </StyledTableRow>
                  {selectedBooking !== undefined && selectedBooking.deposit > 0 && (
                    <StyledTableRow key="deposit">
                      <StyledTableCell component="th" scope="row">
                        Deposit
                      </StyledTableCell>
                      <StyledTableCell scope="row">
                        $
                        {selectedBooking.deposit}
                      </StyledTableCell>
                    </StyledTableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => setBookingOpen(false)} color="secondary">
          Close
        </Button>
        {selectedBooking !== undefined && selectedBooking.approved === false && (
          <Button onClick={(e): void => approveBooking(e)} color="primary">
            Approve
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          {bookingPopup}
          <h4 className="center">Elevator Bookings</h4>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Type</StyledTableCell>
                  <StyledTableCell align="right">Resident</StyledTableCell>
                  <StyledTableCell align="right">Name</StyledTableCell>
                  <StyledTableCell align="right">Phone</StyledTableCell>
                  <StyledTableCell align="right">Ends</StyledTableCell>
                  <StyledTableCell align="right">Status</StyledTableCell>
                  <StyledTableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {bookingType(row)}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.name1}</StyledTableCell>
                    <StyledTableCell align="right">
                      <Link
                        href={`tel:${row.phoneDay}`}
                        rel="noopener"
                      >
                        {row.phoneDay}
                      </Link>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {moment(row.startTime).format('MMM D, YYYY h:mm a')}
                    </StyledTableCell>
                    <StyledTableCell align="right">{moment(row.endTime).format('MMM D, YYYY h:mm a')}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.approved === true && (
                        <div>
                          Approved
                        </div>
                      )}
                      {row.approved === false && (
                        <div>
                          Pending
                        </div>
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton edge="end" aria-label="edit" onClick={(): void => { showBooking(row); }}>
                        <EditIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
}
