import React from 'react';
import * as Parallax from 'react-parallax';
import { Grid } from '@material-ui/core';
import { Route, Routes } from 'react-router-dom';
import Parking from './Parking';
import Admin from './Admin';
import './styles/application.scss';

function App(): JSX.Element {
  return (
    <div className="App">
      <Parallax.Parallax
        bgImage={require('../public/Arrow-Lofts-Rendering.jpg')} // eslint-disable-line global-require
        className="index-banner"
      >
        <div className="section no-pad-bot">
          <div className="container">
            <br />
            <br />
            <h1 className="header center arrow-green">
              <a id="logo-container" href="/" className="brand-logo">
                <img alt="Arrow Lofts" title="Arrow Lofts" className="arrow-logo" src="./ArrowLofts-White.svg" />
              </a>
            </h1>
          </div>
        </div>
      </Parallax.Parallax>
      <div className="container">
        <Routes>
          <Route path="/" element={<Parking />} />
          <Route path="admin" element={<Admin />} />
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
            <a className="white-text" href="https://github.com/djensenius/condomanagement">
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
