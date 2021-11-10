import { AccountCircle, ExitToApp, Settings } from '@mui/icons-material';
import { List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { Link } from 'react-router-dom';
import { sessionAtom } from '../services/globalStore';

interface UserPopupProps {
  handleClose: () => void;
}

const UserPopup: React.FC<UserPopupProps> = (props: UserPopupProps) => {
  const [session, setSession] = useAtom(sessionAtom);

  const handleLogout = () => {
    setSession(null);
    props.handleClose();
  };

  return (
    <Paper sx={{ width: 200 }} elevation={3}>
      <List>
        <ListItem button onClick={props.handleClose} component={Link} to="/account">
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>Account</ListItemText>
        </ListItem>
        {session?.role === 'Administrator' &&
          <ListItem button onClick={props.handleClose} component={Link} to="/admin">
            <ListItemIcon><Settings /></ListItemIcon>
            <ListItemText>Admin settings</ListItemText>
          </ListItem>
        }
        <ListItem button onClick={handleLogout}>
          <ListItemIcon><ExitToApp /></ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </Paper>
  );
};

export default UserPopup;

