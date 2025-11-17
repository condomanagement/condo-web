import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.scss';
import App from './App';

// Configure axios to send cookies for WebAuthn authentication
axios.defaults.withCredentials = true;

const theme = createTheme({
  spacing: 8,
  mixins: {
    toolbar: {
      minHeight: 56,
    },
  },
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);

