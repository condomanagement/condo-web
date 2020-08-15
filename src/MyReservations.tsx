import React, { useEffect, useState } from 'react';
import { MyReservation, UserManager } from 'condo-brain';
import { Grid } from '@material-ui/core';
import {
  Theme,
  createStyles,
  makeStyles,
  withStyles,
} from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
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

export default function MyReservations(): JSX.Element {
  const classes = useStyles();
  const [reservations, setReservations] = useState<MyReservation[]>([]);

  const user = new UserManager();
  const fetchReservations = async (): Promise<void> => {
    user.getMyReservations().then((response: MyReservation[]) => {
      setReservations(response);
    });
  };

  function deleteReservation(id: number): void {
    user.deleteMyReservation(id)
      .then((_response: boolean) => {
        fetchReservations();
      });
  }

  useEffect(() => {
    fetchReservations();
  }, [reservations.length]);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Amenity Reservations</h4>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Amenity</StyledTableCell>
                  <StyledTableCell align="right">Starts</StyledTableCell>
                  <StyledTableCell align="right">Ends</StyledTableCell>
                  <StyledTableCell align="right" />
                </TableRow>
              </TableHead>
              <TableBody>
                {reservations.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.amenity}
                    </StyledTableCell>
                    <StyledTableCell align="right">{moment(row.startTime).format('llll')}</StyledTableCell>
                    <StyledTableCell align="right">{moment(row.endTime).format('llll')}</StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton edge="end" aria-label="delete" onClick={(): void => { deleteReservation(row.id); }}>
                        <DeleteIcon />
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
