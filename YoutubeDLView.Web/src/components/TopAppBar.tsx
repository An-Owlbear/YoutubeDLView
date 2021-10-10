import { Menu as MenuIcon, Search as SearchIcon } from '@mui/icons-material';
import { AppBar, Toolbar, Typography, IconButton, InputBase, alpha, styled } from '@mui/material';
import { useAtom } from "jotai";
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { drawerOpenAtom, sessionAtom } from '../services/globalStore';
import AccountMenu from './AccountMenu';

const AppBarSection = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  minWidth: 300
}));

const HomeLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none'
}));

const SearchBar = styled('form')(() => ({
  display: 'flex',
  alignItems: 'center',
  width: 600,
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  flexGrow: 1,
  color: 'inherit',
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 2),
  marginRight: theme.spacing(1),
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:focus-within': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  }
}));

const AppBarEndSection = styled(AppBarSection)(() => ({
  justifyContent: 'flex-end'
}));

const TopAppBar: React.FC = () => {
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
    <AppBar position="fixed">
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <AppBarSection>
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            size="large"
            sx={{ marginRight: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <HomeLink to="/">
            <Typography variant="h6">YoutubeDLView</Typography>
          </HomeLink>
        </AppBarSection>
        <SearchBar onSubmit={handleSearch}>
          <SearchInput placeholder="Search" value={search} onChange={handleSearchInput} />
          <IconButton sx={{ color: 'inherit' }} type="submit" size="large">
            <SearchIcon />
          </IconButton>
        </SearchBar>
        <AppBarEndSection>
          {session && <AccountMenu />}
        </AppBarEndSection>
      </Toolbar>
    </AppBar>
  );
};

export default TopAppBar;