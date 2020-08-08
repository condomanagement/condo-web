import React, { useEffect, useState } from 'react';
import { AdminManager, User } from 'condo-brain';
import { Grid } from '@material-ui/core';

type UserProp = {
  children: User;
}

const UserLI = (prop: UserProp): JSX.Element => {
  const user = prop.children;
  return (
    <li>{user.name}</li>
  );
};

export default function Admin(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);

  const admin = new AdminManager();
  if (!admin) { return (<div />); }
  const fetchUsers = async (): Promise<void> => {
    admin.getUsers().then((response) => {
      setUsers(response);
      console.warn(`Users ${response}`);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [users.length]);

  return (
    <div className="section flex-grow">
      <Grid container spacing={5}>
        <Grid item xs={12}>
          <h4 className="center">Admin</h4>
          <ul>
            {users.map((user) => <UserLI>{user}</UserLI>)}
          </ul>
        </Grid>
      </Grid>
    </div>
  );
}
