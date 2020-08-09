import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import { AdminManager, User } from 'condo-brain';
import { Grid } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';

type UserProp = {
  children: User;
}

const UserLI = (prop: UserProp): JSX.Element => {
  const user = prop.children;
  return (
    <li>{user.name}</li>
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
}));

export default function Admin(): JSX.Element {
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
          <ul>
            {users.map((user) => <UserLI key={user.name}>{user}</UserLI>)}
          </ul>
        </Grid>
      </Grid>
    </div>
  );
}
