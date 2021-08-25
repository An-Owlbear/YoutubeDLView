import { IconButton, Popover } from '@material-ui/core';
import { AccountCircle } from '@material-ui/icons';
import React, { useState } from 'react';
import UserPopup from './UserPopup';

const AccountMenu: React.FC = () => {
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleAccountClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setUserPopupOpen(!userPopupOpen);
    setAnchorEl(event.currentTarget);
  };

  const handleAccountClose = () => {
    setUserPopupOpen(false);
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton color="inherit" onClick={handleAccountClick}>
        <AccountCircle />
      </IconButton>
      <Popover
        open={userPopupOpen}
        anchorEl={anchorEl}
        onClose={handleAccountClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <UserPopup />
      </Popover>
    </div>
  );
};

export default AccountMenu;