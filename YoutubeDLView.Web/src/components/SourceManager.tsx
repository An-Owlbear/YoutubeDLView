import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React, { useRef, useState } from 'react';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },
  list: {
    width: '100%',
    marginBottom: theme.spacing(2)
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    width: '100%'
  },
  pathText: {
    marginLeft: '12px'
  },
  flexGrow: {
    flexGrow: 1
  }
}));

const SourceManager: React.FC = () => {
  const classes = useStyles();

  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addPath, setAddPath] = useState('');
  const removePath = useRef('');
  const sources = useRequest(HttpClient.getSources, []);
  const addSource = useRequest(() => HttpClient.addSource(addPath), [addPath], { enabled: false });
  const removeSource = useRequest(() => HttpClient.removeSource(removePath.current), [removePath.current], { enabled: false });

  // Adds an item to the sources list
  const addSourceFn = async () => {
    await addSource.refetch();
    if (addSource.error) return;
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
    <div className={classes.root}>
      {!sources.isLoading && sources.data &&
        <div className={classes.list}>
          {sources.data.map(x =>
            <div className={classes.listItem} key={x.path}>
              <Typography className={classes.pathText}>{x.path}</Typography>
              <div className={classes.flexGrow} />
              <IconButton onClick={() => removeSourceFn(x.path)} size="large"><CloseIcon /></IconButton>
            </div>
          )}
        </div>
      }
      <IconButton onClick={() => setAddMenuOpen(true)} size="large">
        <AddIcon />
      </IconButton>
      <Dialog open={addMenuOpen} onClose={handleAddMenuClose} disableScrollLock={true}>
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMenuClose} disabled={addSource.isLoading}>Cancel</Button>
          <Button onClick={addSourceFn} disabled={addSource.isLoading}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SourceManager;