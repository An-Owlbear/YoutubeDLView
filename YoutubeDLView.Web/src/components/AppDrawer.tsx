import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles } from '@material-ui/core';
import { AccountCircle, Home as HomeIcon, VideoLibrary } from '@material-ui/icons';
import { useAtom } from 'jotai';
import React  from 'react';
import { Link } from 'react-router-dom';
import { drawerOpenAtom } from '../services/globalStore';

interface AppDrawerProps {
  width: number;
}

const useStyles = makeStyles(() => ({
  root: {
    width: (props: AppDrawerProps) => props.width,
    flexShrink: 0
  },
  drawerPaper: {
    width: (props: AppDrawerProps) => props.width,
  },
  drawerContainer: {
    overflow: 'auto'
  }
}));

const AppDrawer: React.FC<AppDrawerProps> = (props: AppDrawerProps) => {
  const classes = useStyles(props);

  const [open, setOpen] = useAtom(drawerOpenAtom);

  return (
    <Drawer
      className={classes.root}
      variant="temporary"
      anchor="left"
      open={open}
      classes={{paper: classes.drawerPaper}}
      onClose={() => setOpen(false)}
    >
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/channels">
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>Channels</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/videos">
          <ListItemIcon><VideoLibrary /></ListItemIcon>
          <ListItemText>Videos</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AppDrawer;