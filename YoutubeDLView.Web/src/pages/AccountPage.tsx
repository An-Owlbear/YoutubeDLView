import { Button, makeStyles, TextField, Typography } from '@material-ui/core';
import { Error } from '@material-ui/icons';
import { useAtom } from 'jotai';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Redirect } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    padding: theme.spacing(5),
    border: '1px solid',
    borderColor: theme.palette.divider,
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
  subHeading: {
    marginBottom: theme.spacing(4)
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

const AccountPage: React.FC = () => {
  const classes = useStyles();
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
    <form className={classes.root} onSubmit={handleUpdate}>
      <Typography variant="h5">Change account details</Typography>
      <Typography className={classes.subHeading} variant="body1" color="textSecondary">Leave fields blank to make no changes</Typography>
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
      <div className={classes.bottomContainer}>
        {(validationError || error) &&
          <div className={classes.errorContainer}>
            <Error className={classes.errorIcon} color="error" />
            <Typography color="error">{`${validationError}${error}`}</Typography>
          </div>
        }
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation disabled={isLoading}>Update</Button>
      </div>
    </form>
  );
};

export default AccountPage;