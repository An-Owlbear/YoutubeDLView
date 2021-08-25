import { AppBar, Toolbar, Typography, makeStyles, IconButton } from '@material-ui/core';
import { AccountCircle, Menu as MenuIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useAtom } from "jotai";
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { drawerOpenAtom, sessionAtom } from '../services/globalStore';
import UserPopup from './UserPopup';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1
  },
  spacer: {
    flexGrow: 1
  },
  homeLink: {
    color: 'inherit',
    textDecoration: 'none'
  },
  menuIcon: {
    marginRight: theme.spacing(2)
  },
  userContainer: {
    position: 'relative',
  },
  userPopup: {
    position: 'absolute',
    top: '100%',
    left: 'calc(100% - 200px)',
  },
  displayNone: {
    display: 'none'
  }
}));

const TopAppBar: React.FC = () => {
  const classes = useStyles();
  const [session,] = useAtom(sessionAtom);
  const [, setDrawerOpen] = useAtom(drawerOpenAtom);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar>
        <IconButton
          className={classes.menuIcon}
          color="inherit"
          onClick={() => setDrawerOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Link className={classes.homeLink} to="/">
          <Typography variant="h6">YoutubeDLView</Typography>
        </Link>
        <div className={classes.spacer} />
        {
          session &&
          <div className={classes.userContainer}>
            <IconButton color="inherit" onClick={() => setUserPopupOpen(!userPopupOpen)}>
              <AccountCircle />
            </IconButton>
            <UserPopup className={clsx(classes.userPopup, {[classes.displayNone]: !userPopupOpen})} />
          </div>
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;