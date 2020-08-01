import React from 'react';
import { Footer, Parallax } from 'react-materialize';
import Parking from './Parking';
import 'materialize-css/dist/css/materialize.min.css';
import 'materialize-css/dist/js/materialize';
import './styles/application.scss';
import './styles/parking.scss';

function App(): JSX.Element {
  return (
    <div className="App">
      <Parallax
        image={<img src="./Arrow-Lofts-Rendering.jpg" alt="Arrow Lofts" />}
        className="index-banner"
        options={{
          responsiveThreshold: 0,
        }}
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
      </Parallax>
      <div className="container">
        <Parking />
      </div>
      <Footer
        className="arrow-background-grey"
        copyrights="Made with ❤️ by David"
        links={(
          <div>
            <h5 className="white-text">Additional Resources</h5>
            <ul>
              <li><a className="white-text" href="https://wscc556.frontsteps.com">FrontSteps</a></li>
              <li><a className="white-text" href="https://www.kitchener.ca">City of Kitchener</a></li>
              <li>
                <a className="white-text" href="https://www.kitchener.ca/en/getting-around/parking.aspx">
                  Kitchener Parking Information
                </a>
              </li>
              <li>
                <a className="white-text" href="https://github.com/condomanagment">
                  <span role="img" aria-label="Coding">👩‍💻</span>
                  Open Source Repository
                </a>
              </li>
            </ul>
          </div>
        )}
      >
        <div>
          <h5 className="white-text">Arrow Lofts</h5>
          <p className="grey-text text-lighten-4">
            112 Benton Street
            <br />
            Kitchener, Ontario N2G 3H6
          </p>
          <p className="grey-text text-lighten-4">A beautiful home in a beautiful city.</p>
        </div>
      </Footer>
    </div>
  );
}

export default App;
