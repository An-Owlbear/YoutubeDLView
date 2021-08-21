import { AppBar, Button, Toolbar, Typography, makeStyles, IconButton } from '@material-ui/core';
import { Menu as MenuIcon } from '@material-ui/icons';
import { useAtom } from "jotai";
import React from "react";
import { Link } from 'react-router-dom';
import { sessionAtom } from "../services/globalStore";

interface TopAppBarProps {
  onMenuClick?: React.MouseEventHandler;
}

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
  }
}));

const TopAppBar: React.FC<TopAppBarProps> = (props: TopAppBarProps) => {
  const classes = useStyles();
  const [session, setSession] = useAtom(sessionAtom);

  return (
    <AppBar className={classes.root} position="sticky">
      <Toolbar>
        <IconButton
          className={classes.menuIcon}
          color="inherit"
          onClick={props.onMenuClick}
        >
          <MenuIcon />
        </IconButton>
        <Link className={classes.homeLink} to="/">
          <Typography variant="h6">YoutubeDLView</Typography>
        </Link>
        <div className={classes.spacer} />
        {
          session ?
            <Button color="inherit" onClick={() => setSession(null)}>Logout</Button> :
            <Button color="inherit" component={Link} to="/login">Login</Button>
        }
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;