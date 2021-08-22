import { CssBaseline, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import TopAppBar from "./components/TopAppBar";
import LoginPage from './pages/LoginPage';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  contentHeader: {
    ...theme.mixins.toolbar
  },
  content: {
    flexGrow: 1,
    margin: theme.spacing(5),
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2)
    }
  }
}));

const App = () =>  {
  const classes = useStyles();

  return (
    <React.StrictMode>
      <div className={classes.root}>
        <BrowserRouter>
          <CssBaseline />
          <TopAppBar />
          <AppDrawer width={drawerWidth} />
          <div className={clsx(classes.content)}>
            <div className={classes.contentHeader} />
            <Switch>
              <Route exact path="/" />
              <Route exact path="/login" component={LoginPage} />
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </React.StrictMode>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
