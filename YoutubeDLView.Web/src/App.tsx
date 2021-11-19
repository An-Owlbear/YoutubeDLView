import { CssBaseline, styled } from '@mui/material';
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import '@fontsource/roboto';
import AppDrawer from './components/AppDrawer';
import SnackbarDisplay from './components/SnackbarDisplay';
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
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/videos/:id" element={<VideoPage />} />
          <Route path="/channels" element={<ChannelListPage />} />
          <Route path="/channels/:id" element={<ChannelPage />} />
          <Route path="/search/:search" element={<SearchPage />}  />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/setup" element={<SetupPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Content>
      <SnackbarDisplay />
    </BrowserRouter>
  );
};
