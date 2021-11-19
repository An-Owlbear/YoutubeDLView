import { Error } from '@mui/icons-material';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FlexGrow } from '../components/commonStlyed';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const Root = styled('form')(({ theme }) => ({
  width: '450px',
  marginLeft: 'auto',
  marginRight: 'auto',
  padding: theme.spacing(5),
  outlineColor: theme.palette.divider,
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: '8px',
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  },
  '& > :not(style)': {
    marginTop: theme.spacing(3)
  },
  '& >:first-child': {
    marginTop: 0
  }
}));

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  // Checks if any users exist, and redirects the user to first time signup page if none do
  const infoRequest = useRequest(HttpClient.getSystemInfo, []);
  useEffect(() => {
    if (infoRequest.data && !infoRequest.data.setup) navigate('/signup');
  }, [infoRequest.data]);

  const [values, setValues] = useState({
    username: '',
    password: '',
    usernameError: false,
    passwordError: false,
    errorMessage: ''
  });

  // Handles request errors
  const handleError = (error: string) => {
    const usernameError = loginRequest.error === 'User not found' || loginRequest.error === 'An error occurred';
    const passwordError = loginRequest.error === 'Incorrect password' || loginRequest.error === 'An error occurred';
    setValues({ ...values, usernameError, passwordError, errorMessage: error });
  };

  const loginRequest = useRequest(
    () => HttpClient.login(values.username, values.password),
    [values],
    { enabled: false, errorHandler: handleError });
  const [session, setSession] = useAtom(sessionAtom);

  // Updates values from form changes
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  // Logins in user and sets session
  const handleLogin = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    const response = await loginRequest.refetch();
    if (!response.data) return;
    setSession(response.data);
  };

  // Redirects user to root if logged in, otherwise returns login form
  if (session) return <Navigate to="/" />;
  return (
    <Root onSubmit={handleLogin}>
      <Typography variant="h3">Login</Typography>
      <TextField
        id="username-input"
        name="username"
        label="Username"
        type="text"
        value={values.username}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={loginRequest.isLoading}
        error={values.usernameError}
      />
      <TextField
        id="password-input"
        name="password"
        label="Password"
        type="Password"
        value={values.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={loginRequest.isLoading}
        error={values.passwordError}
      />
      <Box display="flex">
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.light', marginRight: 2, visibility: loginRequest.error ? 'visible' : 'hidden' }}>
          <Error sx={{ marginRight: 1 }} />
          <Typography>{values.errorMessage}</Typography>
        </Box>
        <FlexGrow />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={loginRequest.isLoading}>Login</Button>
      </Box>
    </Root>
  );
};

export default LoginPage;