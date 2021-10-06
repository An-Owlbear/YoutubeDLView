import { ThemeProvider, Theme, StyledEngineProvider, createTheme } from '@mui/material';
import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './App';


declare module '@mui/styles/defaultTheme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends Theme {}
}


const theme = createTheme();

ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}><App /></ThemeProvider>
  </StyledEngineProvider>,
  document.getElementById('root')
);