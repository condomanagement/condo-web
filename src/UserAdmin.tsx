import Grid2 from "@mui/material/Grid2";

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import { AdminManager, User, UserType } from 'condo-brain';
import { Theme } from '@mui/material/styles';
import { createStyles } from './makeStyles';
import { makeStyles } from './makeStyles';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

type UserProp = {
  user: User;
  editUser: (user: User) => void;
}

type UsersProp = {
  localUsers: User[];
  editUser: (user: User) => void;
}

function UserLI(prop: UserProp): React.ReactElement {
  const { user, editUser } = prop;
  const vacState = user.vaccinated ? '💉' : '🦠';
  const primary = `${vacState} ${user.name}`;

  return (
    <ListItem sx={{ opacity: user.active ? 1 : 0.5 }}>
      <ListItemText
        primary={primary}
        secondary={(
          <>
            <Typography
              component="span"
              variant="body2"
              style={{ display: 'inline' }}
              color="textPrimary"
            >
              {`${user.unit}`}
              {'  '}
            </Typography>
            <Typography
              component="span"
              variant="body2"
              style={{ display: 'inline' }}
              color="textPrimary"
            >
              ,
              {'  '}
              {`${user.email}`}

            </Typography>
            {user.active && (
              <Typography
                component="span"
                variant="body2"
                style={{ display: 'inline' }}
                color="textPrimary"
              >
                ,
                {'  '}
                Active
              </Typography>
            )}
            {!user.active && (
              <Typography
                component="span"
                variant="body2"
                style={{ display: 'inline' }}
                color="textPrimary"
              >
                ,
                {'  '}
                Inactive
              </Typography>
            )}
            {!user.admin && user.parkingAdmin && (
              <Typography
                component="span"
                variant="body2"
                style={{ display: 'inline' }}
                color="textPrimary"
              >
                ,
                {'  '}
                Parking Administrator
                {'  '}
              </Typography>
            )}
            {user.admin && (
              <Typography
                component="span"
                variant="body2"
                style={{ display: 'inline' }}
                color="textPrimary"
              >
                ,
                {'  '}
                Administrator
                {'  '}
              </Typography>
            )}
          </>
        )}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="edit"
          onClick={(): void => { editUser(user); }}
          size="large"
        >
          <EditIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}

const ListOfUsers = React.memo((prop: UsersProp) => {
  const usersLI = prop.localUsers.map((user) => (
    <UserLI key={user.id} user={user} editUser={prop.editUser} />
  ));
  return (<List>{usersLI}</List>);
});

const useStyles = makeStyles()((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  title: {
    margin: theme.spacing(4, 0, 2),
  },
  unselected: {
    backgroundColor: 'grey',
  },
  selected: {
    backgroundColor: '#f37f30',
  },
}));

const emptyUser = {
  name: '',
  email: '',
  admin: false,
  active: false,
  vaccinated: false,
  parkingAdmin: false,
  type: UserType.None,
};

export default function UserAdmin(): React.ReactElement {
  const { classes } = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(undefined);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [selectedUser, setSelectedUser] = useState<User>(emptyUser);
  const [userOpen, setUserOpen] = useState(false);
  const [name, setName] = useState(selectedUser.name);
  const [unit, setUnit] = useState(selectedUser.unit);
  const [email, setEmail] = useState(selectedUser.email);
  const [phone, setPhone] = useState(selectedUser.phone);
  const [userAdmin, setUserAdmin] = useState(selectedUser.admin);
  const [userType, setUserType] = useState<UserType>(selectedUser.type);
  const [userParkingAdmin, setUserParkingAdmin] = useState(selectedUser.parkingAdmin);
  const [userActive, setUserActive] = useState(selectedUser.active);
  const [userList, setUserList] = useState(<span />);
  const [hideInactive, setHideInactive] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);
  const [userVaccinated, setUserVaccinated] = useState(false);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  const fetchUsers = async (): Promise<void> => {
    admin.getUsers().then((response) => {
      setUsers(response);
    });
  };

  const handleChange = (selectorFiles: FileList | null): void => {
    if (selectorFiles) {
      setSelectedFiles(selectorFiles);
      setCurrentFile(selectorFiles[0]);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setName(event.target.value);
  };

  const handleUnitChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUnit(Number(event.target.value));
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setPhone(event.target.value);
  };

  const handleAdminChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserAdmin(event.target.checked);
  };

  const handleParkingAdminChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserParkingAdmin(event.target.checked);
  };

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserActive(event.target.checked);
  };

  const handleVaccineChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserVaccinated(event.target.checked);
  };

  const handleHideInactive = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setHideInactive(event.target.checked);
  };

  function addUser(e: React.FormEvent): void {
    e.preventDefault();
    const formData = new FormData();
    formData.append('user[name]', name || '');
    formData.append('user[email]', email || '');
    formData.append('user[phone]', phone || '');
    formData.append('user[unit]', String(unit));
    formData.append('user[admin]', String(userAdmin));
    formData.append('user[parking_admin]', String(userParkingAdmin));
    formData.append('user[vaccinated]', String(userVaccinated));
    formData.append('user[active]', String(userActive));
    formData.append('user[resident_type]', String(userType));
    admin.createUser(formData)
      .then((_response: boolean) => {
        fetchUsers();
        setUserOpen(false);
      });
  }

  const editUser = (user: User): void => {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setName(user.name);
    setUnit(user.unit);
    setEmail(user.email);
    setPhone(user.phone);
    setUserActive(user.active);
    setUserAdmin(user.admin);
    setUserVaccinated(user.vaccinated);
    if (user.parkingAdmin) {
      setUserParkingAdmin(user.parkingAdmin);
    } else {
      setUserParkingAdmin(false);
    }
    setUserOpen(true);
    setUserType(user.type);
  };

  function updateUser(e: React.FormEvent): void {
    if (!selectedUserId) {
      addUser(e);
      setUserOpen(false);
    } else {
      e.preventDefault();
      const formData = new FormData();
      formData.append('user[user_id]', String(selectedUserId));
      formData.append('user[name]', name || '');
      formData.append('user[email]', email || '');
      formData.append('user[phone]', phone || '');
      formData.append('user[unit]', String(unit));
      formData.append('user[admin]', String(userAdmin));
      formData.append('user[parking_admin]', String(userParkingAdmin));
      formData.append('user[active]', String(userActive));
      formData.append('user[resident_type]', String(userType));
      formData.append('user[vaccinated]', String(userVaccinated));
      admin.editUser(formData, Number(selectedUserId))
        .then((_response: boolean) => {
          fetchUsers();
          setUserOpen(false);
        });
    }
  }

  function upload(e: React.FormEvent): void {
    e.preventDefault();
    if (selectedFiles && selectedFiles[0]) {
      const formData = new FormData();
      formData.append('file', selectedFiles[0]);
      admin.upload(formData)
        .then((_response: boolean) => {
          setCurrentFile(undefined);
          fetchUsers();
        })
        .catch(() => {
          setCurrentFile(undefined);
        });
    }
  }

  const userPopup = (
    <form className={classes.root} noValidate autoComplete="off" onSubmit={addUser}>
      <Dialog open={userOpen} aria-labelledby="form-dialog-title" fullWidth>
        {name && (
          <DialogTitle id="form-dialog-title">
            Edit
            {' '}
            {selectedUser.name}
          </DialogTitle>
        )}
        {!name && (
          <DialogTitle id="form-dialog-title">Edit User</DialogTitle>
        )}
        <DialogContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="Name"
                multiline
                maxRows={1}
                value={name}
                onChange={handleNameChange}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="Unit"
                multiline
                maxRows={1}
                value={unit}
                onChange={handleUnitChange}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="Email"
                multiline
                maxRows={1}
                value={email}
                onChange={handleEmailChange}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="standard-multiline-flexible"
                label="Phone Number"
                multiline
                maxRows={1}
                value={phone}
                onChange={handlePhoneChange}
                style={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12}>
              <ButtonGroup
                disableElevation
                variant="contained"
                color="primary"
                aria-label="contained primary button group"
              >
                <Button
                  onClick={(): void => setUserType(UserType.Owner)}
                  className={userType === UserType.Owner ? classes.selected : classes.unselected}
                >
                  Owner
                </Button>
                <Button
                  onClick={(): void => setUserType(UserType.Tenant)}
                  className={userType === UserType.Tenant ? classes.selected : classes.unselected}
                >
                  Tenant
                </Button>
                <Button
                  onClick={(): void => setUserType(UserType.None)}
                  className={(!userType || userType === UserType.None) ? classes.selected : classes.unselected}
                >
                  None
                </Button>
              </ButtonGroup>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={userAdmin}
                    onChange={handleAdminChange}
                    name="administrator"
                    color="primary"
                  />
                )}
                label="Administrator"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={userParkingAdmin}
                    onChange={handleParkingAdminChange}
                    name="parkingAdmin"
                    color="primary"
                  />
                )}
                label="Parking Administrator"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={userActive}
                    onChange={handleActiveChange}
                    name="active"
                    color="primary"
                  />
                )}
                label="Active"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={(
                  <Switch
                    checked={userVaccinated}
                    onChange={handleVaccineChange}
                    name="vaccinated"
                    color="primary"
                  />
                )}
                label="💉 Vaccinated"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={(): void => setUserOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={(e): void => updateUser(e)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );

  useEffect(() => {
    fetchUsers();
  }, [users.length]);

  useEffect(() => {
    let showUsers = users;
    if (hideInactive) {
      showUsers = showUsers.filter((user) => user.active);
    }
    setUserList(<ListOfUsers localUsers={showUsers} editUser={editUser} />);
  }, [users, hideInactive]);

  return (
    <div className="section flex-grow">
      <h4 className="center">Resident Admin</h4>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Button
            sx={{
              backgroundColor: '#f37f30',
              color: 'white',
              marginBottom: '20px',
            }}
            variant="contained"
            component="span"
            onClick={
              (): void => editUser(emptyUser)
            }
          >
            Add Resident
          </Button>
        </Grid>
        <Grid item xs={4}>
          <FormControlLabel
            control={(
              <Switch
                checked={hideInactive}
                onChange={handleHideInactive}
                name="active"
                color="primary"
              />
            )}
            label="Hide Inactive Residents"
          />
        </Grid>
        <Grid item xs={12}>
          {userList}
          {userPopup}
          <form encType="multipart/form-data" className={classes.root} noValidate autoComplete="off" onSubmit={upload}>
            <label htmlFor="upload-users">
              <input
                style={{ display: 'none' }}
                id="upload-users"
                name="upload-users"
                type="file"
                onChange={(e): void => handleChange(e.target.files)}
              />
              {!currentFile && (
                <div>
                  <Button
                    sx={{
                      backgroundColor: '#f37f30',
                      color: 'white',
                      marginBottom: '20px',
                    }}
                    variant="contained"
                    component="span"
                  >
                    Choose JSON file
                  </Button>
                  {' '}
                </div>
              )}
              {currentFile && (
                <Button
                  sx={{
                    backgroundColor: '#f37f30',
                    color: 'white',
                    marginBottom: '20px',
                  }}
                  variant="contained"
                  type="submit"
                >
                  Upload
                  {'  '}
                  {currentFile.name}
                </Button>
              )}
            </label>
          </form>
        </Grid>
      </Grid>
    </div>
  );
}
