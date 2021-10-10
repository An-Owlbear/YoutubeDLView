import { Error } from '@mui/icons-material';
import { Button, styled, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const Root = styled('form')(({ theme }) => ({
  width: 450,
  padding: theme.spacing(5),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  },
  '& > :not(style)': {
    margin: theme.spacing(1, 0)
  },
  '& :first-child': {
    marginTop: 0
  },
  '& :last-child': {
    marginBottom: 0
  }
}));

const BottomContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center'
}));

const ErrorContainer = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const FlexGrow = styled('div')(() => ({
  flexGrow: 1
}));

const SignupPage: React.FC = () => {
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
    <Root onSubmit={handleSignup}>
      <Typography sx={{ marginBottom: 2 }} variant="h5">Create first user</Typography>
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
      <BottomContainer>
        {(validationError || signupRequest.error || loginRequest.error) &&
        <ErrorContainer>
          <Error sx={{ marginRight: 1 }} color="error" />
          <Typography color="error">{`${validationError}${signupRequest.error}${loginRequest.error}`}</Typography>
        </ErrorContainer>
        }
        <FlexGrow />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={signupRequest.isLoading || loginRequest.isLoading}>Signup</Button>
      </BottomContainer>
    </Root>
  );
};

export default SignupPage;