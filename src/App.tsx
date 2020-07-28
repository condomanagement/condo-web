import React from 'react';
import logo from './logo.svg';
import './App.scss';
import 'materialize-css/dist/css/materialize.min.css';
import { Button, Card, Row, Col } from 'react-materialize';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload!!!
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div>
        <Button
          node="button"
          waves="light"
        >
          button
        </Button>
      </div>
    </div>
  );
}

export default App;
