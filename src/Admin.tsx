import React from 'react';
import { AdminManager } from 'condo-brain';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Box,
  Paper,
  Tab,
  Tabs,
} from '@material-ui/core';
import UserAdmin from './UserAdmin';

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
}));

interface TabPanelProps {
  children: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps): JSX.Element {
  const { children, value, index } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Admin(): JSX.Element {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <Paper square>
        <Tabs
          value={value}
          variant="fullWidth"
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="admin tabs"
        >
          <Tab label="Parking" disabled />
          <Tab label="Users" />
          <Tab label="Ameneties" disabled />
          <Tab label="Questions" />
          <Tab label="Reservations" disabled />
        </Tabs>

        <TabPanel value={value} index={0}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1}>
          <UserAdmin />
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Four
        </TabPanel>
        <TabPanel value={value} index={4}>
          Item Five
        </TabPanel>
      </Paper>
    </div>
  );
}
