import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, Amenity } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

type AmenityProp = {
  children: Amenity;
}

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

export default function AmenityAdmin(): JSX.Element {
  const classes = useStyles();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [value, setValue] = useState('');
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

  function deleteAmenity(amenity: Amenity): void {
    setAmenityToDelete(amenity.id);
    setSelectedAmenity(amenity);
    setDeleteOpen(true);
  }

  function editAmenity(amenity: Amenity): void {
    setSelectedAmenity(amenity);
    setTimeLimit(amenity.timeLimit);
    setValue(amenity.name);
    setAmenityOpen(true);
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

  useEffect(() => {
    fetchAmenities();
  }, [amenities.length]);

  const AmenityLI = (prop: AmenityProp): JSX.Element => {
    const amenity = prop.children;
    const primary = amenity.name;
    const secondary = minutesToReadable(amenity.timeLimit);

    return (
      <ListItem>
        <ListItemText
          primary={primary}
          secondary={secondary}
        />
        <ListItemSecondaryAction>
          <>
            <IconButton edge="end" aria-label="edit" onClick={(): void => { editAmenity(amenity); }}>
              <EditIcon />
            </IconButton>
            <IconButton edge="end" aria-label="delete" onClick={(): void => { deleteAmenity(amenity); }}>
              <DeleteIcon />
            </IconButton>
          </>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

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
          <Grid item xs={12}>
            <List>
              {amenities.map((amenity) => <AmenityLI key={amenity.id}>{amenity}</AmenityLI>)}
            </List>
          </Grid>
          <Grid item xs={12}>
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
              <Grid item xs={12}>
                <TextField
                  id="standard-multiline-flexible"
                  label="Enter new amenity"
                  multiline
                  rowsMax={4}
                  value={value}
                  onChange={handleChange}
                  style={{ width: '100%' }}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel htmlFor="time-limit">Time Limit</InputLabel>
                <Select
                  native
                  value={timeLimit}
                  onChange={handleTimeLimitChange}
                  inputProps={{
                    name: 'timeLimit',
                    id: 'timeLimit',
                  }}
                  style={{ width: '100%' }}
                >
                  {times}
                </Select>
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
