import { CssBaseline, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import TopAppBar from "./components/TopAppBar";
import AccountPage from './pages/AccountPage';
import ChannelListPage from './pages/ChannelListPage';
import ChannelPage from './pages/ChannelPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import SetupPage from './pages/SetupPage';
import SignupPage from './pages/SignupPage';
import VideoPage from './pages/VideoPage';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  contentHeader: theme.mixins.toolbar,
  content: {
    margin: theme.spacing(5),
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'center',
    '& > *': {
      alignSelf: 'center'
    },
    [theme.breakpoints.down('xs')]: {
      margin: theme.spacing(2)
    }
  }
}));

const App = () =>  {
  const classes = useStyles();

  return (
    <div>
      <BrowserRouter>
        <CssBaseline />
        <TopAppBar />
        <AppDrawer width={drawerWidth} />
        <div className={classes.contentHeader} />
        <div className={clsx(classes.content)}>
          <Switch>
            <Route exact path="/" component={MainPage} />
            <Route exact path="/login" component={LoginPage} />
            <Route exact path="/videos/:id" component={VideoPage} />
            <Route exact path="/channels" component={ChannelListPage} />
            <Route exact path="/channels/:id" component={ChannelPage} />
            <Route exact path="/search/:search" component={SearchPage}  />
            <Route exact path="/account" component={AccountPage} />
            <Route exact path="/signup" component={SignupPage} />
            <Route exact path="/setup" component={SetupPage} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
