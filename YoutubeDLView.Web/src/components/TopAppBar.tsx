import { AppBar, Toolbar, Typography, makeStyles, IconButton, InputBase, alpha } from '@material-ui/core';
import { Menu as MenuIcon, Search as SearchIcon } from '@material-ui/icons';
import clsx from 'clsx';
import { useAtom } from "jotai";
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { drawerOpenAtom, sessionAtom } from '../services/globalStore';
import AccountMenu from './AccountMenu';

const useStyles = makeStyles((theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 1
  },
  appBar: {
    justifyContent: 'space-between'
  },
  appBarSection: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 300
  },
  appBarEndSection: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  homeLink: {
    color: 'inherit',
    textDecoration: 'none'
  },
  menuIcon: {
    marginRight: theme.spacing(2)
  },
  searchBar: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    width: 600,
  },
  searchRoot: {
    flexGrow: 1,
    color: 'inherit',
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(0.5, 2),
    marginRight: theme.spacing(1),
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:focus-within': {
      backgroundColor: alpha(theme.palette.common.white, 0.25)
    }
  },
  searchIcon: {
    color: 'inherit',
  }
}));

const TopAppBar: React.FC = () => {
  const classes = useStyles();
  const [session,] = useAtom(sessionAtom);
  const [, setDrawerOpen] = useAtom(drawerOpenAtom);
  const history = useHistory();
  const [search, setSearch] = useState('');

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
  };

  const handleSearch = (event: FormEvent<HTMLElement>) => {
    event.preventDefault();
    if (!search) return;
    history.push(`/search/${search}`);
  };

  return (
    <AppBar className={classes.root} position="fixed">
      <Toolbar className={classes.appBar}>
        <div className={classes.appBarSection}>
          <IconButton className={classes.menuIcon} color="inherit" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
          <Link className={classes.homeLink} to="/">
            <Typography variant="h6">YoutubeDLView</Typography>
          </Link>
        </div>
        <form className={classes.searchBar} onSubmit={handleSearch}>
          <InputBase classes={{root: classes.searchRoot}} placeholder="Search" value={search} onChange={handleSearchInput} />
          <IconButton className={classes.searchIcon} type="submit">
            <SearchIcon />
          </IconButton>
        </form>
        <div className={clsx(classes.appBarSection, classes.appBarEndSection)}>
          {session && <AccountMenu />}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;