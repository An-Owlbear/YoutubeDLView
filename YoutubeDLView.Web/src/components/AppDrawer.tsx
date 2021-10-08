import { AccountCircle, Home as HomeIcon, VideoLibrary } from '@mui/icons-material';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useAtom } from 'jotai';
import React  from 'react';
import { Link } from 'react-router-dom';
import { drawerOpenAtom } from '../services/globalStore';

interface AppDrawerProps {
  width: number;
}

const AppDrawer: React.FC<AppDrawerProps> = (props: AppDrawerProps) => {
  const [open, setOpen] = useAtom(drawerOpenAtom);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      variant="temporary"
      anchor="left"
      open={open}
      onClose={() => setOpen(false)}
      sx={{ width: props.width, flexShrink: 0, '& .MuiDrawer-paper': { width: props.width }}}
    >
      <List>
        <ListItem button component={Link} to="/" onClick={handleClose}>
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button component={Link} to="/channels" onClick={handleClose}>
          <ListItemIcon><AccountCircle /></ListItemIcon>
          <ListItemText>Channels</ListItemText>
        </ListItem>
        <ListItem button component={Link} to="/videos" onClick={handleClose}>
          <ListItemIcon><VideoLibrary /></ListItemIcon>
          <ListItemText>Videos</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default AppDrawer;