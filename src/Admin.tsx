import React from 'react';
import { AdminManager, UserManager } from 'condo-brain';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import { useNavigate } from 'react-router-dom';
import UserAdmin from './UserAdmin';
import QuestionAdmin from './QuestionAdmin';
import AmenityAdmin from './AmenityAdmin';
import ReservationAdmin from './ReservationAdmin';
import ParkingAdmin from './ParkingAdmin';

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
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
  },
  tab: {
    padding: theme.spacing(1.5),
    fontSize: theme.typography.pxToRem(16),
  },
}));

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index } = props;
  const admin = new AdminManager();
  const navigate = useNavigate();

  if (!admin) { navigate('/'); }

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Admin({ userManager }: { userManager: UserManager }): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  if (!userManager.isAdmin && !userManager.isParkingAdmin) { return (<div />); }

  const handleChange = (_event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      { userManager.isAdmin && (
        <Paper square>
          <div className={classes.center}>
            <Tabs
              value={value}
              variant="scrollable"
              indicatorColor="primary"
              textColor="primary"
              onChange={handleChange}
              aria-label="scrollable auto admin tabs"
              scrollButtons="auto"
            >
              <Tab className={classes.tab} label="Parking" />
              <Tab className={classes.tab} label="Users" />
              <Tab className={classes.tab} label="Amenities" />
              <Tab className={classes.tab} label="Questions" />
              <Tab className={classes.tab} label="Reservations" />
            </Tabs>
          </div>

          <TabPanel value={value} index={0}>
            <ParkingAdmin />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <UserAdmin />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <AmenityAdmin />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <QuestionAdmin />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <ReservationAdmin />
          </TabPanel>
        </Paper>
      )}
      { !userManager.isAdmin && userManager.isParkingAdmin && (
        <ParkingAdmin />
      )}
    </div>
  );
}
