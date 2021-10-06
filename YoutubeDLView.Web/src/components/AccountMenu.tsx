import { AccountCircle } from '@mui/icons-material';
import { IconButton, Popover } from '@mui/material';
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
      <IconButton color="inherit" onClick={handleAccountClick} size="large">
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
        disableScrollLock={true}
      >
        <UserPopup handleClose={handleAccountClose} />
      </Popover>
    </div>
  );
};

export default AccountMenu;