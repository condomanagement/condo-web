import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, User } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

type UserProp = {
  user: User;
}

type UsersProp = {
  localUsers: User[];
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

const emptyUser = {
  name: '',
  email: '',
  admin: false,
  active: false,
};

export default function UserAdmin(): JSX.Element {
  const classes = useStyles();
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
  const [userActive, setUserActive] = useState(selectedUser.active);
  const [userList, setUserList] = useState(<span />);
  const [hideInactive, setHideInactive] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState<number | undefined>(undefined);

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

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setUserActive(event.target.checked);
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
    formData.append('user[active]', String(userActive));
    admin.createUser(formData)
      .then((_response: boolean) => {
        fetchUsers();
        setUserOpen(false);
      });
  }

  function editUser(user: User): void {
    setSelectedUser(user);
    setSelectedUserId(user.id);
    setName(user.name);
    setUnit(user.unit);
    setEmail(user.email);
    setPhone(user.phone);
    setUserActive(user.active);
    setUserAdmin(user.admin);
    setUserOpen(true);
  }

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
      formData.append('user[active]', String(userActive));
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

  const UserLI = (prop: UserProp): JSX.Element => {
    const { user } = prop;
    const primary = user.name;

    return (
      <ListItem>
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
              {`${user.email}`}
              {user.active && (
                <Typography
                  component="span"
                  variant="body2"
                  style={{ display: 'inline' }}
                  color="textPrimary"
                >
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
                  {'  '}
                  Inactive
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
          <IconButton edge="end" aria-label="edit" onClick={(): void => { editUser(user); }}>
            <EditIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  };

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
                rowsMax={1}
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
                rowsMax={1}
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
                rowsMax={1}
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
                rowsMax={1}
                value={phone}
                onChange={handlePhoneChange}
                style={{ width: '100%' }}
              />
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
                    checked={userActive}
                    onChange={handleActiveChange}
                    name="active"
                    color="primary"
                  />
                )}
                label="Active"
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
    setUserList(<ListOfUsers localUsers={showUsers} />);
  }, [users, hideInactive]);

  const ListOfUsers = React.memo((prop: UsersProp) => {
    const usersLI = prop.localUsers.map((user) => (
      <UserLI key={user.id} user={user} />
    ));
    return (<List>{usersLI}</List>);
  });

  return (
    <div className="section flex-grow">
      <h4 className="center">Resident Admin</h4>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Button
            className={classes.registerButton}
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
                  <Button className={classes.registerButton} variant="contained" component="span">
                    Choose JSON file
                  </Button>
                  {' '}
                </div>
              )}
              {currentFile && (
                <Button className={classes.registerButton} variant="contained" type="submit">
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
