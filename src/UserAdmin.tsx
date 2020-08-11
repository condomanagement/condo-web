import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, User } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

type UserProp = {
  children: User;
}

const UserLI = (prop: UserProp): JSX.Element => {
  const user = prop.children;
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
            {user.admin && (
              <Typography
                component="span"
                variant="body2"
                style={{ display: 'inline' }}
                color="textPrimary"
              >
                {'  '}
                Administrator
              </Typography>
            )}
          </>
        )}
      />
    </ListItem>
  );
};

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

export default function UserAdmin(): JSX.Element {
  const classes = useStyles();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | undefined>(undefined);
  const [currentFile, setCurrentFile] = useState<File | undefined>(undefined);
  const [, setProgress] = useState(0);
  const [, setMessage] = useState('');

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  const fetchUsers = async (): Promise<void> => {
    admin.getUsers().then((response) => {
      setUsers(response);
      console.warn(`Users ${response}`);
    });
  };

  const handleChange = (selectorFiles: FileList | null): void => {
    if (selectorFiles) {
      setSelectedFiles(selectorFiles);
      setCurrentFile(selectorFiles[0]);
    }
  };

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
          setProgress(0);
          setMessage('Could not upload the file!');
          setCurrentFile(undefined);
        });
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [users.length]);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Admin</h4>
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
          <List>
            {users.map((user) => <UserLI key={user.name}>{user}</UserLI>)}
          </List>
        </Grid>
      </Grid>
    </div>
  );
}
