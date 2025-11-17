import { UserManager } from '@condomanagement/condo-brain';
import { faDolly } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import EventAvailable from '@mui/icons-material/EventAvailable';
import LocalParking from '@mui/icons-material/LocalParking';
import MenuIcon from '@mui/icons-material/Menu';
import Schedule from '@mui/icons-material/Schedule';
import Settings from '@mui/icons-material/Settings';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import {
  CSSObject,
  Theme,
  styled,
  useTheme,
} from '@mui/material/styles';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { get as getCookie } from 'es-cookie';
import React from 'react';
import Avatar from 'react-avatar';
import { useNavigate } from 'react-router-dom';
import PasskeySetupPrompt from './PasskeySetupPrompt';

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function NavBar({ userManager }: { userManager: UserManager }): React.ReactElement {
  const theme = useTheme();
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [pageTitle, setPageTitle] = React.useState('Amenity Reservation');
  const [open, setOpen] = React.useState(false);
  const [showPasskeyPrompt, setShowPasskeyPrompt] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const avatarOpen = Boolean(anchorEl);

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
      // Force a full page reload to reset auth state
      window.location.href = '/';
    });
    handleClose();
  };

  let toolBar;
  if (auth) {
    toolBar = (
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar
          position="fixed"
          open={open}
        >
          <Toolbar sx={{ backgroundColor: '#f37f30' }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {pageTitle}
            </Typography>
            <IconButton
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
              size="large"
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
              open={avatarOpen}
              onClose={handleClose}
            >
              <MenuItem onClick={(): void => { navigate('myreservations'); }}>My Reservations</MenuItem>
              <MenuItem onClick={(): void => { navigate('settings'); }}>Settings</MenuItem>
              <MenuItem onClick={logout}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </DrawerHeader>
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
              <Tooltip title="Visitor Parking Registration" placement="right-end">
                <ListItemButton key="parking">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><LocalParking /></ListItemIcon>
                  <ListItemText primary="Parking" />
                </ListItemButton>
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
                <ListItemButton key="reservation">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><EventAvailable /></ListItemIcon>
                  <ListItemText primary="Reserve Amenity" />
                </ListItemButton>
              </Tooltip>
            </Link>

            <Link
              href="/elevator-booking"
              onClick={(e: React.SyntheticEvent): void => {
                e.preventDefault();
                navigate('elevator-booking');
                setPageTitle('Elevator Booking');
              }}
              color="inherit"
              underline="none"
            >
              <Tooltip title="Elevator Booking">
                <ListItemButton key="elevator-booking">
                  <ListItemIcon style={{ paddingLeft: '5px' }}>
                    <FontAwesomeIcon icon={faDolly} size="lg" />
                  </ListItemIcon>
                  <ListItemText primary="Elevator Booking" />
                </ListItemButton>
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
                <ListItemButton key="myreservations">
                  <ListItemIcon style={{ paddingLeft: '5px' }}><Schedule /></ListItemIcon>
                  <ListItemText primary="My reservations" />
                </ListItemButton>
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
                    <ListItemButton key="administration">
                      <ListItemIcon style={{ paddingLeft: '5px' }}><Settings /></ListItemIcon>
                      <ListItemText primary="Administration" />
                    </ListItemButton>
                  </Tooltip>
                </Link>
              </List>
            </>
          )}
        </Drawer>
      </Box>
    );
  } else {
    toolBar = (
      <AppBar position="static">
        <Toolbar sx={{ backgroundColor: '#f37f30' }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }} />
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
    <div>
      {toolBar}
    </div>
  );
}
