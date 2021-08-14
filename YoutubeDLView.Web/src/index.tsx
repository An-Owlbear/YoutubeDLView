import { CssBaseline } from "@material-ui/core";
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from "react-router-dom";
import '@fontsource/roboto'
import TopAppBar from "./components/TopAppBar";

ReactDOM.render(
  <React.StrictMode>
    <CssBaseline />
    <BrowserRouter>
      <TopAppBar />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
