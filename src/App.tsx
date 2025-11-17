import { PasskeyManager, UserManager } from '@condomanagement/condo-brain';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { get as getCookie } from 'es-cookie';
import React from 'react';
import * as Parallax from 'react-parallax';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import Admin from './Admin';
import Authenticate from './Authenticate';
import ElevatorBooking from './ElevatorBooking';
import Home from './Home';
import ArrowLoftsRendering from './images/Arrow-Lofts-Rendering.jpg';
import ArrowLoftsWhite from './images/ArrowLofts-White.svg';
import Login from './Login';
import { makeStyles } from './makeStyles';
import MyReservations from './MyReservations';
import Nav from './Nav';
import Parking from './Parking';
import PasskeySetupPrompt from './PasskeySetupPrompt';
import Reservation from './Reservation';
import Settings from './Settings';
import { isPlatformAuthenticatorAvailable } from './utils/passkey';
import './styles/application.scss';

const useStyles = makeStyles()((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...(theme.mixins.toolbar as any),
  },
  content: {
    flexGrow: 1,
  },
}));

function App(): React.ReactElement {
  const [userManager] = React.useState(new UserManager());
  const [auth, setAuth] = React.useState(false);
  const [rootState, setRootState] = React.useState<string | undefined>(undefined);
  const [showPasskeyPrompt, setShowPasskeyPrompt] = React.useState(false);
  const [toolbarState, setToolbarState] = React.useState<string | undefined>(undefined);
  const [contentState, setContentState] = React.useState<string | undefined>(undefined);
  const { classes } = useStyles();
  const navigate = useNavigate();
  const location = useLocation();
  const passkeyManager = new PasskeyManager();

  React.useEffect(() => {
    if (auth) {
      passkeyManager.list().then((credentials) => {
        setShowPasskeyPrompt(credentials.length === 0);
      }).catch(() => {
        setShowPasskeyPrompt(false);
      });
    } else {
      setShowPasskeyPrompt(false);
    }
  }, [auth]);

  const checkLogin = (): void => {
    const token = getCookie('token');
    if (token) {
      userManager.validateToken(token).then((_result) => {
        if (userManager.loggedIn) {
          setAuth(true);
          setRootState(classes.root as string);
          setToolbarState(classes.toolbar as string);
          setContentState(classes.content as string);
          if (location.pathname === '/') {
            navigate('/reservation');
          }
        } else {
          setAuth(false);
          setRootState(undefined);
          setToolbarState(undefined);
          setContentState(undefined);
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

  // Check if we should show passkey setup prompt
  React.useEffect(() => {
    const checkPasskeySetup = async (): Promise<void> => {
      console.log('Checking passkey setup, auth:', auth, 'logged in:', userManager.loggedIn);
      if (auth && userManager.loggedIn) {
        const isSupported = await isPlatformAuthenticatorAvailable();
        console.log('Passkey supported:', isSupported);
        if (!isSupported) return;

        try {
          const token = getCookie('token');
          if (!token) {
            console.log('No token found');
            return;
          }

          const passkeys = await passkeyManager.listCredentials(token);
          console.log('User has', passkeys.length, 'passkeys');
          if (passkeys.length === 0) {
            console.log('Showing passkey prompt');
            setShowPasskeyPrompt(true);
          }
        } catch (error) {
          console.error('Error checking passkey status:', error);
        }
      }
    };

    checkPasskeySetup();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth, userManager.loggedIn]);

  return (
    <div className="App">
      <div className={rootState}>
        <CssBaseline />
        <Nav userManager={userManager} />
        <main className={contentState}>
          <div className={toolbarState} />
          <Parallax.Parallax
            bgImage={ArrowLoftsRendering}
            className="index-banner"
          >
            <div className="section no-pad-bot">
              <div className="container">
                <h1 className="header center arrow-green">
                  <a id="logo-container" href="/" className="brand-logo">
                    <img
                      alt="Arrow Lofts"
                      title="Arrow Lofts"
                      className="arrow-logo"
                      src={ArrowLoftsWhite}
                    />
                  </a>
                </h1>
              </div>
            </div>
          </Parallax.Parallax>
          <div className="container">
            {showPasskeyPrompt && auth && <PasskeySetupPrompt onSetupComplete={() => setShowPasskeyPrompt(false)} />}
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/parking" element={<Parking userManager={userManager} />} />
              <Route path="admin" element={<Admin userManager={userManager} />} />
              <Route path="login" element={<Login userManager={userManager} />} />
              <Route path="authenticate/:emailtoken" element={<Authenticate userManager={userManager} />} />
              <Route path="reservation" element={<Reservation />} />
              <Route path="elevator-booking" element={<ElevatorBooking userManager={userManager} />} />
              <Route path="myreservations" element={<MyReservations userManager={userManager} />} />
              <Route path="settings" element={<Settings />} />
            </Routes>
          </div>
          <footer
            className="page-footer arrow-background-grey"
          >
            <div className="container section flex-grow">
              <Grid container spacing={5}>
                <Grid size={{ xs: 6 }}>
                  <h5 className="white-text">Arrow Lofts</h5>
                  <p className="grey-text text-lighten-4">
                    112 Benton Street
                    <br />
                    Kitchener, Ontario N2G 3H6
                  </p>
                  <p className="grey-text text-lighten-4">A beautiful home in a beautiful city.</p>
                </Grid>
                <Grid size={{ xs: 6 }}>
                  <h5 className="white-text">Additional Resources</h5>
                  <ul>
                    <li>
                      <a className="white-text" href="https://condocontrolcentral.com/login">
                        Condo Control Central
                      </a>
                    </li>
                    <li><a className="white-text" href="https://www.kitchener.ca/">City of Kitchener</a></li>
                    <li>
                      <a className="white-text" href="https://www.kitchener.ca/en/getting-around/parking.aspx">
                        Kitchener Parking Information
                      </a>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>
            <div className="footer-copyright">
              <div className="container">
                <a className="white-text" href="https://github.com/condomanagement">
                  Open Source and Built with
                  <span role="img" aria-label="love">❤️ </span>
                  by David
                </a>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;
