import React from 'react';
import * as Parallax from 'react-parallax';
import { Grid } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';
import { UserManager } from 'condo-brain';
import Parking from './Parking';
import Admin from './Admin';
import Authenticate from './Authenticate';
import Reservation from './Reservation';
import Login from './Login';
import Nav from './Nav';
import MyReservations from './MyReservations';
import './styles/application.scss';
import ArrowLoftsWhite from './images/ArrowLofts-White.svg';
import ArrowLoftsRendering from './images/Arrow-Lofts-Rendering.jpg';

function App(): JSX.Element {
  const [userManager] = React.useState(new UserManager());

  return (
    <div className="App">
      <Nav userManager={userManager} />
      <Parallax.Parallax
        bgImage={ArrowLoftsRendering}
        className="index-banner"
      >
        <div className="section no-pad-bot">
          <div className="container">
            <br />
            <br />
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
        <Routes>
          <Route path="/" element={<Parking />} />
          <Route path="admin" element={<Admin />} />
          <Route path="login" element={<Login userManager={userManager} />} />
          <Route path="authenticate/:emailtoken" element={<Authenticate userManager={userManager} />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="myreservations" element={<MyReservations />} />
        </Routes>
      </div>
      <footer
        className="page-footer arrow-background-grey"
      >
        <div className="container section flex-grow">
          <Grid container spacing={5}>
            <Grid item xs={6}>
              <h5 className="white-text">Arrow Lofts</h5>
              <p className="grey-text text-lighten-4">
                112 Benton Street
                <br />
                Kitchener, Ontario N2G 3H6
              </p>
              <p className="grey-text text-lighten-4">A beautiful home in a beautiful city.</p>
            </Grid>
            <Grid item xs={6}>
              <h5 className="white-text">Additional Resources</h5>
              <ul>
                <li><a className="white-text" href="https://wscc556.evercondo.com/">FrontSteps</a></li>
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
    </div>
  );
}

export default App;
