import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import { LoginInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';
import { useApiRequest } from '../services/useApiRequest';

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
  const requestBody = useMemo(() => ({ username: values.username, password: values.password }), [values.username, values.password]);

  const [signupError, signupLoading, sendSignupRequest] = useApiRequest(
    '/api/users/setup',
    'post',
    false,
    { body: requestBody }
  );

  const [loginError, loginLoading, sendLoginRequest] = useApiRequest<LoginInformation>(
    '/api/auth/login',
    'post',
    false,
    { body: requestBody }
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
    await sendSignupRequest();
    if (signupError) return;
    const response = await sendLoginRequest();
    if (loginError) return;
    setSession(response);
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
        disabled={signupLoading || loginLoading}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={signupLoading || loginLoading}
      />
      <TextField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={signupLoading || loginLoading}
      />
      <div className={classes.bottomContainer}>
        {(validationError || signupError || loginError) &&
        <div className={classes.errorContainer}>
          <Error className={classes.errorIcon} color="error" />
          <Typography color="error">{`${validationError}${signupError}${loginError}`}</Typography>
        </div>
        }
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={signupLoading || loginLoading}>Signup</Button>
      </div>
    </form>
  );
};

export default SignupPage;