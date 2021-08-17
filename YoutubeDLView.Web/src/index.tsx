import { CssBaseline, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import TopAppBar from "./components/TopAppBar";
import LoginPage from './pages/LoginPage';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  content: {
    margin: theme.spacing(5),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    marginLeft: theme.spacing(5) + drawerWidth,
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }
}));

const App = () =>  {
  const classes = useStyles();

  const [open, setOpen] = useState(true);

  return (
    <React.StrictMode>
      <BrowserRouter>
        <CssBaseline />
        <TopAppBar onMenuClick={() => setOpen(!open)} />
        <AppDrawer open={open} width={drawerWidth} />
        <div className={clsx(classes.content, {[classes.contentShift]: open})}>
          <Switch>
            <Route exact path="/" />
            <Route exact path="/login" component={LoginPage} />
          </Switch>
        </div>
      </BrowserRouter>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
