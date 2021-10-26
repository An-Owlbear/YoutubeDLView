import { Error } from '@mui/icons-material';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, styled, Typography } from '@mui/material';
import React from 'react';
import { UserAccount } from '../models/apiModels';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';

interface DeleteUserPopupProps {
  user: UserAccount | undefined;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ErrorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
  color: theme.palette.error.light
}));

const DeleteUserPopup: React.FC<DeleteUserPopupProps> = (props) => {
  const { isLoading, error, refetch } = useRequest(
    () => HttpClient.deleteAccount(props.user?.id ?? ''),
    [props.user?.id],
    { enabled: false }
  );

  const onClose = () => {
    if (isLoading) return;
    props.onClose();
  };

  const handleRequest = async () => {
    const response = await refetch();
    if (!response.success) return;
    props.onSuccess();
    props.onClose();
  };

  return (
    <Dialog open={props.open} onClose={onClose}>
      <DialogTitle>Delete user account {props.user?.username}?</DialogTitle>
      <DialogContent>
        {error &&
          <ErrorContainer>
            <Error sx={{ mr: 1 }}/>
            <Typography>{error}</Typography>
          </ErrorContainer>
        }
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button onClick={handleRequest} disabled={isLoading}>Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteUserPopup;