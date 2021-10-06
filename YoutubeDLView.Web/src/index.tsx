import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';

const theme = createMuiTheme();

ReactDOM.render(
  <ThemeProvider theme={theme}><App /></ThemeProvider>,
  document.getElementById('root')
);