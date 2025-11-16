import Grid from "@mui/material/Grid";

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import { AdminManager, Amenity } from '@condomanagement/condo-brain';
import { Theme } from '@mui/material/styles';
import { createStyles } from './makeStyles';
import { makeStyles } from './makeStyles';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import List from '@mui/material/List';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import AmenityLI from './AmenityLi';

const useStyles = makeStyles()((theme) => ({
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

export default function AmenityAdmin(): React.ReactElement {
  const { classes } = useStyles();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [value, setValue] = useState('');
  const [visible, setVisible] = useState(true);
  const [vaccine, setVaccine] = useState(false);
  const [timeLimit, setTimeLimit] = useState(60);
  const [selectedAmenity, setSelectedAmenity] = useState<Amenity | undefined>(undefined);
  const [amenityOpen, setAmenityOpen] = useState(false);
  const [amenityToDelete, setAmenityToDelete] = useState(0);
  const [deleteOpen, setDeleteOpen] = React.useState(false);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  const fetchAmenities = async (): Promise<void> => {
    admin.getAmenities().then((response) => {
      setAmenities(response);
    });
  };

  function addAmenity(e: React.FormEvent): void {
    e.preventDefault();
    const formData = new FormData();
    formData.append('resource[name]', value);
    formData.append('resource[time_limit]', String(timeLimit));
    formData.append('resource[visible]', String(visible));
    formData.append('resource[vaccine]', String(vaccine));
    admin.createAmenity(formData)
      .then((_response: boolean) => {
        setValue('');
        fetchAmenities();
        setAmenityOpen(false);
      });
  }

  function doDeleteAmenity(): void {
    admin.deleteAmenity(amenityToDelete)
      .then((_response: boolean) => {
        fetchAmenities();
        setDeleteOpen(false);
      });
  }

  function updateAmenity(e: React.FormEvent, amenity?: Amenity): void {
    if (!amenity) {
      addAmenity(e);
      setAmenityOpen(false);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append('resource[name]', value);
      formData.append('resource[time_limit]', String(timeLimit));
      formData.append('resource[visible]', String(visible));
      formData.append('resource[vaccine]', String(vaccine));
      formData.append('resource[id]', String(amenity.id));
      admin.editAmenity(formData, amenity.id)
        .then((_response: boolean) => {
          setValue('');
          fetchAmenities();
          setAmenityOpen(false);
        });
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  const handleVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVisible(event.target.checked);
  };

  const handleVaccineChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setVaccine(event.target.checked);
  };

  useEffect(() => {
    fetchAmenities();
  }, [amenities.length]);

  const times = [];
  for (let t = 15; t <= 240; t += 15) {
    const timeText = minutesToReadable(t);
    times.push(<option key={t} value={t}>{timeText}</option>);
  }

  const handleTimeLimitChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>): void => {
    const time = event.target.value;
    setTimeLimit(Number(time));
  };

  const deleteConfirmation = (
    <Dialog
      open={deleteOpen}
      onClose={(): void => setDeleteOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Delete
        {' '}
        &ldquo;
        {selectedAmenity?.name}
        &rdquo;?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          If you delete this amenity all associated reservations will also be deleted.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={(): void => setDeleteOpen(false)} color="primary">
          Cancel
        </Button>
        <Button onClick={(): void => doDeleteAmenity()} color="primary" autoFocus>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <>
      <h4 className="center">Amenity Admin</h4>
      <div className="section flex-grow">
        <Grid container spacing={5}>
          <Grid size={{ xs: 12 }}>
            <List>
              {amenities.map((amenity) => (
                <AmenityLI
                  key={amenity.id}
                  setAmenityToDelete={setAmenityToDelete}
                  setSelectedAmenity={setSelectedAmenity}
                  setDeleteOpen={setDeleteOpen}
                  setTimeLimit={setTimeLimit}
                  setValue={setValue}
                  setVisible={setVisible}
                  setVaccine={setVaccine}
                  setAmenityOpen={setAmenityOpen}
                >
                  {amenity}
                </AmenityLI>
              ))}
            </List>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Button
              className={classes.registerButton}
              variant="contained"
              onClick={(): void => {
                setTimeLimit(60);
                setValue('');
                setSelectedAmenity(undefined);
                setAmenityOpen(true);
              }}
            >
              Add Amenity
            </Button>
          </Grid>
        </Grid>
      </div>
      <form className={classes.root} noValidate autoComplete="off" onSubmit={addAmenity}>
        <Dialog open={amenityOpen} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Edit Amenity</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedAmenity?.name}
            </DialogContentText>
            <Grid container spacing={5}>
              <Grid size={{ xs: 12 }}>
                <TextField
                  id="standard-multiline-flexible"
                  label="Enter new amenity"
                  multiline
                  maxRows={4}
                  value={value}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="timeLimit">Time Limit</InputLabel>
                  <Select
                    native
                    value={timeLimit}
                    onChange={() => handleTimeLimitChange}
                    inputProps={{
                      name: 'timeLimit',
                      id: 'timeLimit',
                    }}
                    label="Time Limit"
                  >
                    {times}
                  </Select>
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={visible}
                      onChange={handleVisibilityChange}
                      name="visible"
                      color="primary"
                    />
                  )}
                  label="Visible"
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <FormControlLabel
                  control={(
                    <Switch
                      checked={vaccine}
                      onChange={handleVaccineChange}
                      name="visible"
                      color="primary"
                    />
                  )}
                  label="💉 Requires Vaccine"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={(): void => setAmenityOpen(false)} color="secondary">
              Cancel
            </Button>
            <Button onClick={(e): void => updateAmenity(e, selectedAmenity)} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </form>
      {deleteConfirmation}
    </>
  );
}
