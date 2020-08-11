import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, Amenity } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import TextField from '@material-ui/core/TextField';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

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

export default function AmenityAdmin(): JSX.Element {
  const classes = useStyles();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [value, setValue] = useState('');

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
    admin.createAmenity(formData)
      .then((_response: boolean) => {
        setValue('');
        fetchAmenities();
      });
  }

  function deleteAmenity(id: number): void {
    admin.deleteAmenity(id)
      .then((_response: boolean) => {
        fetchAmenities();
      });
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

    return (
      <ListItem>
        <ListItemText
          primary={primary}
        />
        <ListItemSecondaryAction>
          <IconButton edge="end" aria-label="delete" onClick={(): void => { deleteAmenity(amenity.id); }}>
            <DeleteIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Admin</h4>
          <form className={classes.root} noValidate autoComplete="off" onSubmit={addAmenity}>
            <TextField
              id="standard-multiline-flexible"
              label="Enter new amenity"
              multiline
              rowsMax={4}
              value={value}
              onChange={handleChange}
            />
            <Button className={classes.registerButton} variant="contained" type="submit">
              Add Aminety
            </Button>
          </form>
          <List>
            {amenities.map((amenity) => <AmenityLI key={amenity.id}>{amenity}</AmenityLI>)}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}
