import React from 'react';
import {
  Theme,
  createStyles,
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { useNavigate } from 'react-router-dom';
import { get as getCookie } from 'es-cookie';
import { UserManager } from 'condo-brain';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import LocalParking from '@material-ui/icons/LocalParking';
import Settings from '@material-ui/icons/Settings';
import Schedule from '@material-ui/icons/Schedule';
import EventAvailable from '@material-ui/icons/EventAvailable';
import Avatar from 'react-avatar';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
  },
  menuButton: {
    marginRight: 36,
  },
  title: {
    flexGrow: 1,
  },
  orangeBg: {
    backgroundColor: '#f37f30',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
    [theme.breakpoints.down('xs')]: {
      width: 0,
      display: 'none',
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

export default function NavBar({ userManager }: { userManager: UserManager }): JSX.Element {
  const classes = useStyles();
  const theme = useTheme();
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [pageTitle, setPageTitle] = React.useState('Amenity Reservation');

  const handleDrawerOpen = (): void => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = (): void => {
    setOpenDrawer(false);
  };
  const open = Boolean(anchorEl);

  const navigate = useNavigate();

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
    setAnchorEl(null);
  };

  const logout = (): void => {
    const token = getCookie('token');
    if (!token) { return; }
    userManager.logout(token).then((result) => {
      if (result === false) {
        return;
      }
      setAuth(false);
      navigate('/');
    });
    handleClose();
  };

  let toolBar;
  if (auth) {
    toolBar = (
      <>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: openDrawer,
          })}
        >
          <Toolbar className={classes.orangeBg}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: openDrawer,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {pageTitle}
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar md5Email={userManager.md5Email} name={userManager.fullname} color="#93C83E" size="40" round />
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
              <MenuItem onClick={(): void => navigate('myreservations')}>My Reservations</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: openDrawer,
              [classes.drawerClose]: !openDrawer,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          <List>
            <Link
              href="/parking"
              onClick={(e: React.SyntheticEvent): void => {
                e.preventDefault();
                navigate('/parking');
                setPageTitle('Visitor Parking Registration');
              }}
              color="inherit"
              underline="none"
            >
              <Tooltip title="Visitor Parking Registration">
                <ListItem button key="parking">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><LocalParking /></ListItemIcon>
                  <ListItemText primary="Parking" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link
              href="/reservation"
              onClick={(e: React.SyntheticEvent): void => {
                e.preventDefault();
                navigate('reservation');
                setPageTitle('Amenity Reservation');
              }}
              color="inherit"
              underline="none"
            >
              <Tooltip title="Amenity Reservation">
                <ListItem button key="reservation">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><EventAvailable /></ListItemIcon>
                  <ListItemText primary="Reserve Amenity" />
                </ListItem>
              </Tooltip>
            </Link>

            <Link
              href="/myreservations"
              onClick={(e: React.SyntheticEvent): void => {
                e.preventDefault();
                navigate('myreservations');
                setPageTitle('My Reservations');
              }}
              color="inherit"
              underline="none"
            >
              <Tooltip title="My Reservations">
                <ListItem button key="myreservations">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><Schedule /></ListItemIcon>
                  <ListItemText primary="My reservations" />
                </ListItem>
              </Tooltip>
            </Link>
          </List>
          {(userManager.isAdmin || userManager.isParkingAdmin) && (
            <>
              <Divider />
              <List>
                <Link
                  href="/admin"
                  onClick={(e: React.SyntheticEvent): void => {
                    e.preventDefault();
                    navigate('admin');
                    setPageTitle('Administration');
                  }}
                  color="inherit"
                  underline="none"
                >
                  <Tooltip title="Administration">
                    <ListItem button key="administration">
                      <ListItemIcon style={{ paddingLeft: '5px' }}><Settings /></ListItemIcon>
                      <ListItemText primary="Administration" />
                    </ListItem>
                  </Tooltip>
                </Link>
              </List>
            </>
          )}
        </Drawer>
      </>
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
            Amenities reservation login
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
