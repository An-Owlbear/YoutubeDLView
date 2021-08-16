import { Drawer, List, ListItem, ListItemIcon, ListItemText, makeStyles, Toolbar } from '@material-ui/core';
import { AccountCircle, Home as HomeIcon, VideoLibrary } from '@material-ui/icons';
import React  from 'react';

interface AppDrawerProps {
  open: boolean;
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

  return (
    <Drawer
      className={classes.root}
      variant="persistent"
      anchor="left"
      open={props.open}
      classes={{paper: classes.drawerPaper}}
    >
      <Toolbar />
      <List>
        <ListItem button key="Home">
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button key="Channels">
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>Channels</ListItemText>
        </ListItem>
        <ListItem button key="Videos">
          <ListItemIcon><VideoLibrary /></ListItemIcon>
          <ListItemText>Videos</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AppDrawer;