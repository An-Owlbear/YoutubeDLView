import { Error } from '@mui/icons-material';
import { Box, Button, styled, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
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

const FlexGrow = styled('div')(() => ({
  flexGrow: 1
}));

const LoginPage: React.FC = () => {
  const history = useHistory();

  // Checks if any users exist, and redirects the user to first time signup page if none do
  const usersRequest = useRequest(HttpClient.getUsers, []);
  useEffect(() => {
    if (usersRequest.data && usersRequest.data.length === 0) history.push('/signup');
  }, [usersRequest.data]);

  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const loginRequest = useRequest(() => HttpClient.login(values.username, values.password), [values], { enabled: false });
  const [session, setSession] = useAtom(sessionAtom);

  const usernameError = () => loginRequest.error === 'User not found' || loginRequest.error === 'An error occurred';
  const passwordError = () => loginRequest.error === 'Incorrect password' || loginRequest.error === 'An error occurred';

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
  if (session) return <Redirect to="/" />;
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
        error={usernameError()}
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
        error={passwordError()}
      />
      <Box display="flex">
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'error.light', marginRight: 2, visibility: loginRequest.error ? 'visible' : 'hidden' }}>
          <Error sx={{ marginRight: 1 }} />
          <Typography>{loginRequest.error}</Typography>
        </Box>
        <FlexGrow />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={loginRequest.isLoading}>Login</Button>
      </Box>
    </Root>
  );
};

export default LoginPage;