import { AppBar, Button, Toolbar, Typography, makeStyles } from '@material-ui/core';
import React from "react";
import { Link } from 'react-router-dom';

const useStyles = makeStyles(() => ({
  spacer: {
    flexGrow: 1
  },
  homeLink: {
    color: 'inherit',
    textDecoration: 'none'
  }
}));

const TopAppBar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Link className={classes.homeLink} to="/">
          <Typography variant="h6">YoutubeDLView</Typography>
        </Link>
        <div className={classes.spacer} />
        <Button color="inherit" component={Link} to="/login">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;