import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { Link } from 'react-router-dom';
import { get as getCookie } from 'es-cookie';
import { UserManager } from 'condo-brain';

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  orangeBg: {
    backgroundColor: '#f37f30',
  },
}));

export default function NavBar({ userManager }: { userManager: UserManager }): JSX.Element {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const checkLogin = (): void => {
    const token = getCookie('token');
    if (token) {
      userManager.validateToken(token).then((_result) => {
        if (userManager.loggedIn) {
          setAuth(true);
        } else {
          setAuth(false);
        }
      });
    }
  };

  React.useEffect(() => {
    if (!userManager) { return; }
    checkLogin();
    const timer = setTimeout(() => {
      checkLogin();
      clearTimeout(timer);
    }, 1000);
  }, [auth]);

  const handleMenu = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (): void => {
    const token = getCookie('token');
    if (!token) { return; }
    userManager.logout(token).then((result) => {
      if (result === false) {
        return;
      }
      setAuth(false);
    });
    setAnchorEl(null);
  };

  let toolBar;
  if (auth) {
    toolBar = (
      <AppBar position="static">
        <Toolbar className={classes.orangeBg}>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">Parking</Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to="/reservation">Reserve Amenity</Link>
          </Typography>
          <Typography variant="h6" className={classes.title}>
            <Link to="/admin">Admin</Link>
          </Typography>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
    );
  } else {
    toolBar = (
      <AppBar position="static">
        <Toolbar className={classes.orangeBg}>
          <Typography variant="h6" className={classes.title} />
          <Button
            color="inherit"
            href="/login"
          >
            Login
          </Button>
        </Toolbar>
      </AppBar>
    );
  }

  return (
    <div className={classes.root}>
      {toolBar}
    </div>
  );
}
