import { CssBaseline, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import TopAppBar from "./components/TopAppBar";
import LoginPage from './pages/LoginPage';
import { store } from './reducers/combinedReducers';

const drawerWidth = 250;

const useStyles = makeStyles((theme) => ({
  content: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  contentShift: {
    marginLeft: drawerWidth,
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
      <Provider store={store}>
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
      </Provider>
    </React.StrictMode>
  );
};

// eslint-disable-next-line react/no-render-return-value
const renderApp = () => ReactDOM.render(<App />, document.getElementById('root'));
renderApp();

store.subscribe(renderApp);