import { List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper } from '@material-ui/core';
import { AccountCircle, ExitToApp } from '@material-ui/icons';
import clsx from 'clsx';
import { useAtom } from 'jotai';
import React from 'react';
import { Link } from 'react-router-dom';
import { sessionAtom } from '../services/globalStore';

interface UserPopupProps {
  className?: string;
  handleClose: () => void;
}

const useStyles = makeStyles(() => ({
  root: {
    width: 200,
  }
}));

const UserPopup: React.FC<UserPopupProps> = (props: UserPopupProps) => {
  const classes = useStyles();

  const [, setSession] = useAtom(sessionAtom);

  const handleLogout = () => {
    setSession(null);
    props.handleClose();
  };

  return (
    <Paper className={clsx([classes.root], props.className)} elevation={3}>
      <List>
        <ListItem button onClick={props.handleClose} component={Link} to="/account">
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>Account</ListItemText>
        </ListItem>
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};

export default UserPopup;

