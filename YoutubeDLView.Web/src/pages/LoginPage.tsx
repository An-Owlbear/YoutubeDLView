import { Box, Button, makeStyles, TextField, Theme, Typography } from '@material-ui/core';
import React, { ChangeEvent, useState } from 'react';

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
      width: '90%'
    },
    '& > *': {
      marginTop: theme.spacing(3)
    },
    '& >:first-child': {
      marginTop: 0
    }
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

  return (
    <form className={classes.root}>
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
      />
      <Box display="flex">
        <div className={classes.flexGrow} />
        <Button type="submit" variant="contained" color="primary" disableElevation>Login</Button>
      </Box>
    </form>
  );
};

export default LoginPage;