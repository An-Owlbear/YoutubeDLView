import { CssBaseline, styled } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import TopAppBar from "./components/TopAppBar";
import AccountPage from './pages/AccountPage';
import AdminPage from './pages/AdminPage';
import ChannelListPage from './pages/ChannelListPage';
import ChannelPage from './pages/ChannelPage';
import LoginPage from './pages/LoginPage';
import MainPage from './pages/MainPage';
import SearchPage from './pages/SearchPage';
import SetupPage from './pages/SetupPage';
import SignupPage from './pages/SignupPage';
import VideoPage from './pages/VideoPage';

const drawerWidth = 250;

const ContentHeader = styled('div')(({ theme }) => theme.mixins.toolbar);

const Content = styled('div')(({ theme }) => ({
  margin: theme.spacing(5),
  display: 'flex',
  flexDirection: 'column',
  alignContent: 'center',
  '& > *': {
    alignSelf: 'center'
  },
  [theme.breakpoints.down('sm')]: {
    margin: theme.spacing(2)
  }
}));

export const App: React.FC = () =>  {
  return (
    <BrowserRouter>
      <CssBaseline />
      <TopAppBar />
      <AppDrawer width={drawerWidth} />
      <ContentHeader />
      <Content>
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
          <Route exact path="/admin" component={AdminPage} />
        </Switch>
      </Content>
    </BrowserRouter>
  );
};
