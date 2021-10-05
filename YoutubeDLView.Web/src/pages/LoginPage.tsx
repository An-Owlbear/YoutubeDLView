import { Box, Button, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: '450px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: theme.spacing(5),
    outlineColor: theme.palette.divider,
    border: '1px solid',
    borderColor: theme.palette.divider,
    borderRadius: '8px',
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '& > *': {
      marginTop: theme.spacing(3)
    },
    '& >:first-child': {
      marginTop: 0
    }
  },
  errorBox: {
    color: theme.palette.error.light,
    marginRight: theme.spacing(2),
  },
  errorIcon: {
    marginRight: theme.spacing(1)
  },
  hidden: {
    visibility: 'hidden'
  },
  flexGrow: {
    flexGrow: 1
  }
}));

const LoginPage: React.FC = () => {
  const classes = useStyles();
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
    <form className={classes.root} onSubmit={handleLogin}>
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
        <Box className={clsx(classes.errorBox, {[classes.hidden]: !loginRequest.error})} display="flex" alignItems="center">
          <Error className={classes.errorIcon} />
          <Typography>{loginRequest.error}</Typography>
        </Box>
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={loginRequest.isLoading}>Login</Button>
      </Box>
    </form>
  );
};

export default LoginPage;