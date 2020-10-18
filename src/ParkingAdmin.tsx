import React, { useEffect, useState } from 'react';
import { AdminManager, ParkingRegistration } from 'condo-brain';
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
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
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

export default function ParkingAdmin(): JSX.Element {
  const classes = useStyles();
  const [registration, setRegistrations] = useState<ParkingRegistration[]>([]);
  const [whenView, setWhenView] = useState<string>('today');

  const admin = new AdminManager();
  if (!admin) { return (<div />); }

  const fetchRegistrations = async (): Promise<void> => {
    admin.getParkingRegistrations(whenView).then((response) => {
      setRegistrations(response);
    });
  };

  const handleWhen = (_event: React.MouseEvent<HTMLElement>, newAlignment: string | null): void => {
    if (newAlignment !== null) {
      setWhenView(newAlignment);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, [whenView]);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Parking Registration Admin</h4>
          <Grid item xs={12} className="center">
            <ToggleButtonGroup
              value={whenView}
              exclusive
              onChange={handleWhen}
              aria-label="registrations from"
            >
              <ToggleButton value="past" aria-label="past">
                Past
              </ToggleButton>
              <ToggleButton value="today" aria-label="centered">
                Today
              </ToggleButton>
              <ToggleButton value="future" aria-label="right aligned">
                Future
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Make</StyledTableCell>
                  <StyledTableCell align="right">Colour</StyledTableCell>
                  <StyledTableCell align="right">License</StyledTableCell>
                  <StyledTableCell align="right">Starts</StyledTableCell>
                  <StyledTableCell align="right">Ends</StyledTableCell>
                  <StyledTableCell align="right">Unit</StyledTableCell>
                  <StyledTableCell align="right">Contact</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {registration.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row">
                      {row.make}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.color}</StyledTableCell>
                    <StyledTableCell align="right">{row.license}</StyledTableCell>
                    <StyledTableCell align="right">{moment(row.startDate).format('LL')}</StyledTableCell>
                    <StyledTableCell align="right">{moment(row.endDate).format('LL')}</StyledTableCell>
                    <StyledTableCell align="right">{row.unit}</StyledTableCell>
                    <StyledTableCell align="right">{row.contact}</StyledTableCell>
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
