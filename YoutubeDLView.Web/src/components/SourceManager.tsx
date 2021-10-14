import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useRef, useState } from 'react';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';

const Root = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%'
}));

const SourceList = styled('div')(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2)
}));

const SourceListItem = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '100%'
}));

const SourceManager: React.FC = () => {
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addPath, setAddPath] = useState('');
  const removePath = useRef('');
  const sources = useRequest(HttpClient.getSources, []);
  const addSource = useRequest(() => HttpClient.addSource(addPath), [addPath], { enabled: false });
  const removeSource = useRequest(() => HttpClient.removeSource(removePath.current), [removePath.current], { enabled: false });

  // Adds an item to the sources list
  const addSourceFn = async () => {
    const response = await addSource.refetch();
    setAddPath('');
    if (!response.success) return;
    await sources.refetch();
    setAddMenuOpen(false);
  };

  // Removes an item from the sources list
  const removeSourceFn = async (pathToRemove: string) => {
    removePath.current = pathToRemove;
    await removeSource.refetch();
    if (removeSource.error) return;
    await sources.refetch();
  };

  // Handles closing the add menu
  const handleAddMenuClose = () => {
    if (addSource.isLoading) return;
    setAddMenuOpen(false);
  };

  return (
    <Root>
      {!sources.isLoading && sources.data &&
        <SourceList>
          {sources.data.map(x =>
            <SourceListItem key={x.path}>
              <Typography sx={{ marginLeft: '12px' }}>{x.path}</Typography>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton onClick={() => removeSourceFn(x.path)} size="large"><CloseIcon /></IconButton>
            </SourceListItem>
          )}
        </SourceList>
      }
      <IconButton onClick={() => setAddMenuOpen(true)} size="large">
        <AddIcon />
      </IconButton>
      <Dialog open={addMenuOpen} onClose={handleAddMenuClose} disableScrollLock={true} maxWidth="xs" fullWidth>
        <DialogTitle>Enter video source path</DialogTitle>
        <DialogContent>
          <TextField
            name="path"
            label="Path"
            type="text"
            value={addPath}
            onChange={e => setAddPath(e.target.value)}
            variant="outlined"
            fullWidth
            disabled={addSource.isLoading}
            margin="dense"
            error={!!addSource.error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMenuClose} disabled={addSource.isLoading}>Cancel</Button>
          <Button onClick={addSourceFn} disabled={addSource.isLoading}>Add</Button>
        </DialogActions>
      </Dialog>
    </Root>
  );
};

export default SourceManager;