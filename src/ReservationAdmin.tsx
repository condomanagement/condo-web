import React, { useEffect, useState } from 'react';
import { AdminManager, Reservation } from 'condo-brain';
import { Grid } from '@mui/material';
import { Theme } from '@mui/material/styles';
import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';
import withStyles from '@mui/styles/withStyles';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
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

export default function ReservationAdmin(): JSX.Element {
  const classes = useStyles();
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }

  const fetchReservations = async (): Promise<void> => {
    admin.getReservations().then((response) => {
      setReservations(response);
    });
  };

  useEffect(() => {
    fetchReservations();
  }, [reservations.length]);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Amenity Reservation Admin</h4>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Amenity</StyledTableCell>
                  <StyledTableCell align="right">Resident</StyledTableCell>
                  <StyledTableCell align="right">Email</StyledTableCell>
                  <StyledTableCell align="right">Starts</StyledTableCell>
                  <StyledTableCell align="right">Ends</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.amenity}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.userName}</StyledTableCell>
                    <StyledTableCell align="right">{row.userEmail}</StyledTableCell>
                    <StyledTableCell align="right">{moment(row.startTime).format('llll')}</StyledTableCell>
                    <StyledTableCell align="right">{moment(row.endTime).format('llll')}</StyledTableCell>
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
