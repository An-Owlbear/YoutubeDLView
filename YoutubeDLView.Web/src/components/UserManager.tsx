import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import { Avatar, IconButton, styled, Typography } from '@mui/material';
import React, { useState } from 'react';
import { UserAccount } from '../models/apiModels';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';
import AddUserPopup from './AddUserPopup';
import DeleteUserPopup from './DeleteUserPopup';
import { FlexGrow } from './commonStlyed';

const Root = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
}));

const UserList = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  '& > *': {
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  '& :last-child': {
    border: 0
  }
}));

const UserListItem = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1)
}));

const UserManager: React.FC = () => {
  const [addUserPopup, setAddUserPopup] = useState(false);
  const [deleteUser, setDeleteUser] = useState<UserAccount>();
  const usersRequest = useRequest(HttpClient.getUsers, []);

  return (
    <Root>
      {!usersRequest.isLoading && usersRequest.data &&
        <UserList>
          {usersRequest.data.map(x =>
            <UserListItem key={x.id}>
              <Avatar sx={{ marginLeft: '12px' }}>{x.username.charAt(0)}</Avatar>
              <Typography sx={{ marginLeft: '12px' }}>{x.username}</Typography>
              <FlexGrow />
              <IconButton size="large" onClick={() => setDeleteUser(x)}><CloseIcon /></IconButton>
            </UserListItem>
          )}
        </UserList>
      }
      <IconButton size="large" onClick={() => setAddUserPopup(true)}>
        <AddIcon />
      </IconButton>
      <AddUserPopup open={addUserPopup} onClose={() => setAddUserPopup(false)} onSuccess={usersRequest.refetch} />
      <DeleteUserPopup user={deleteUser} open={!!deleteUser} onClose={() => setDeleteUser(undefined)} onSuccess={usersRequest.refetch} />
    </Root>
  );
};

export default UserManager;