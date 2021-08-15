import { CssBaseline } from "@material-ui/core";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import TopAppBar from "./components/TopAppBar";
import LoginPage from './pages/LoginPage';
import { store } from './reducers/combinedReducers';

const App = () =>  {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <BrowserRouter>
          <CssBaseline />
          <TopAppBar />
          <Switch>
            <Route exact path="/" />
            <Route exact path="/login" component={LoginPage} />
          </Switch>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
};

// eslint-disable-next-line react/no-render-return-value
const renderApp = () => ReactDOM.render(<App />, document.getElementById('root'));
renderApp();

store.subscribe(renderApp);