import { Box, Button, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import axios, { AxiosError } from 'axios';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { LoginInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';

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

  const [values, setValues] = useState({
    username: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState( '');

  const usernameError = () => error === 'User not found' || error === 'An error occurred';
  const passwordError = () => error === 'Incorrect password' || error === 'An error occurred';

  const [session, setSession] = useAtom(sessionAtom);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  const handleLogin = async (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await axios.post('/api/Auth/Login', values);
      const data: LoginInformation = response.data;
      setSession({username: data.username, accessToken: data.accessToken, refreshToken: data.refreshToken});
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = (error as AxiosError).response?.data;
        setError(errorMessage);
      } else {
        setError('An error occurred');
      }
    }
    setLoading(false);
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
        disabled={loading}
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
        disabled={loading}
        error={passwordError()}
      />
      <Box display="flex">
        <Box className={clsx(classes.errorBox, {[classes.hidden]: !error})} display="flex" alignItems="center">
          <Error className={classes.errorIcon} />
          <Typography>{error}</Typography>
        </Box>
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={loading}>Login</Button>
      </Box>
    </form>
  );
};

export default LoginPage;