import { Error } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  styled,
  TextField,
  Typography
} from '@mui/material';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';

interface AddUserPopupProps {
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

const AddUserPopup: React.FC<AddUserPopupProps> = (props) => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const { isLoading, error, refetch } = useRequest(
    () => HttpClient.addUser(values.username, values.password),
    [values.username, values.password],
    { enabled: false }
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [event.target.name]: event.target.value });
  };

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

  const handleFormRequest = (event: FormEvent) => {
    event.preventDefault();
    handleRequest();
  };

  return (
    <Dialog open={props.open} onClose={onClose} disableScrollLock={true} maxWidth="xs" fullWidth>
      <DialogTitle>Add user</DialogTitle>
      <DialogContent>
        <form onSubmit={handleFormRequest}>
          <TextField
            name="username"
            label="Username"
            type="text"
            value={values.username}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            margin="dense"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            value={values.password}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            margin="dense"
          />
          <TextField
            name="confirmPassword"
            label="Confirm password"
            type="password"
            value={values.confirmPassword}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            disabled={isLoading}
            margin="dense"
          />
          {/*Invisible submit button to allow form to be submitted when pressing enter*/}
          <Button sx={{display: 'none'}} type="submit" />
          {error &&
            <ErrorContainer>
              <Error sx={{ mr: 1 }}/>
              <Typography>{error}</Typography>
            </ErrorContainer>
          }
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>Cancel</Button>
        <Button onClick={handleRequest} disabled={isLoading}>Add</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserPopup;