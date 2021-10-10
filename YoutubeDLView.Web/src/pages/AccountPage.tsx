import { Error } from '@mui/icons-material';
import { Button, styled, TextField, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const Root = styled('form')(({ theme }) => ({
  width: 600,
  padding: theme.spacing(5),
  border: '1px solid',
  borderColor: theme.palette.divider,
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
  flexDirection: 'row',
  alignItems: 'center'
}));

const ErrorContainer = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
}));

const FlexGrow = styled('div')(() => ({
  flexGrow: 1
}));

const AccountPage: React.FC = () => {
  const [session, setSession] = useAtom(sessionAtom);
  const [values, setValues] = useState({
    username: session?.username,
    password: '',
    confirmPassword: ''
  });

  const [validationError, setValidationError] = useState('');
  const { error, isLoading, refetch } = useRequest(
    () => HttpClient.updateAccount(session?.userId ?? '', values.username ?? '', values.password),
    [session?.userId, values.username, values.password],
    { enabled: false }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({...values, [event.target.name]: event.target.value});
  };

  // Sends the request to update user information
  const handleUpdate = async (event: FormEvent<HTMLElement>) => {
    setValidationError('');
    event.preventDefault();

    // Checks passwords are the same
    if (values.password !== values.confirmPassword) {
      setValidationError('Passwords must be matching');
      return;
    }

    // Sends request and updates username
    await refetch();
    if (!error && values.username && session) setSession({...session, username: values.username});
  };

  if (!session) return <Redirect to="/" />;
  return (
    <Root onSubmit={handleUpdate}>
      <Typography variant="h5">Change account details</Typography>
      <Typography sx={{ marginBottom: 4 }} variant="body1" color="textSecondary">Leave fields blank to make no changes</Typography>
      <TextField
        name="username"
        label="Username"
        type="text"
        value={values.username}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={isLoading}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        value={values.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={isLoading}
      />
      <TextField
        name="confirmPassword"
        label="Confirm password"
        type="password"
        value={values.confirmPassword}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        disabled={isLoading}
      />
      <BottomContainer>
        {(validationError || error) &&
          <ErrorContainer>
            <Error sx={{ marginRight: 1 }} color="error" />
            <Typography color="error">{`${validationError}${error}`}</Typography>
          </ErrorContainer>
        }
        <FlexGrow />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={isLoading}>Update</Button>
      </BottomContainer>
    </Root>
  );
};

export default AccountPage;