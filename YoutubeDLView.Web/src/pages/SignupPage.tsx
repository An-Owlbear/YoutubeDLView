import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 450,
    padding: theme.spacing(5),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    },
    '& > *': {
      margin: theme.spacing(1, 0)
    },
    '& :first-child': {
      marginTop: 0
    },
    '& :last-child': {
      marginBottom: 0
    }
  },
  header: {
    marginBottom: theme.spacing(2)
  },
  bottomContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorIcon: {
    marginRight: theme.spacing(1)
  },
  flexGrow: {
    flexGrow: 1
  }
}));

const SignupPage: React.FC = () => {
  const classes = useStyles();

  const [session, setSession] = useAtom(sessionAtom);
  const history = useHistory();
  const [values, setValues] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [validationError, setValidationError] = useState('');
  const signupRequest = useRequest(
    () => HttpClient.signup(values.username, values.password),
    [values.username, values.password],
    { enabled: false }
  );
  const loginRequest = useRequest(
    () => HttpClient.login(values.username, values.password),
    [values.username, values.password],
    { enabled: false }
  );

  // Updates the form values
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [event.target.name]: event.target.value});
  };

  // Creates the users account and logs them in
  const handleSignup = async (event: FormEvent<HTMLElement>) => {
    setValidationError('');
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      setValidationError('Passwords must be matching');
      return;
    }

    // Sends signup request, and if successful sends login request
    await signupRequest.refetch();
    if (signupRequest.error) return;
    const response = await loginRequest.refetch();
    if (loginRequest.error || !response.data) return;
    setSession(response.data);
    history.push('/setup');
  };

  if (session) return <Redirect to="/" />;
  return (
    <form className={classes.root} onSubmit={handleSignup}>
      <Typography className={classes.header} variant="h5">Create first user</Typography>
      <TextField
        name="username"
        label="Username"
        type="text"
        value={values.username}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={signupRequest.isLoading || loginRequest.isLoading}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={signupRequest.isLoading || loginRequest.isLoading}
      />
      <TextField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={signupRequest.isLoading || loginRequest.isLoading}
      />
      <div className={classes.bottomContainer}>
        {(validationError || signupRequest.error || loginRequest.error) &&
        <div className={classes.errorContainer}>
          <Error className={classes.errorIcon} color="error" />
          <Typography color="error">{`${validationError}${signupRequest.error}${loginRequest.error}`}</Typography>
        </div>
        }
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={signupRequest.isLoading || loginRequest.isLoading}>Signup</Button>
      </div>
    </form>
  );
};

export default SignupPage;