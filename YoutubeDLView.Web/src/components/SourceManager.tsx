import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  makeStyles,
  TextField,
  Typography
} from '@material-ui/core';
import { Add as AddIcon, Close as CloseIcon } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { SourceInformation } from '../models/apiModels';
import { useApiRequest } from '../services/useApiRequest';

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

  const [sources, setSources] = useState<SourceInformation[]>([]);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [addPath, setAddPath] = useState('');
  const [sourcesError, sourcesLoading, sendSourcesRequest] = useApiRequest<SourceInformation[]>('/api/config/sources', 'get', true);
  const [addError, addLoading, sendAddRequest] = useApiRequest('/api/config/sources', 'put', true, { body: { path: addPath } });
  const [deleteError, deleteLoading, sendDeleteRequest] = useApiRequest('/api/config/sources', 'delete', true);

  // Loads current video sources
  useEffect(() => {
    const loadVideos = async () => {
      const response = await sendSourcesRequest();
      if (!response) return;
      setSources(response);
    };
    loadVideos();
  }, []);

  // Adds an item to the sources list
  const addSource = async () => {
    await sendAddRequest();
    console.log(addError);
    if (addError) return;
    setSources([...sources, { path: addPath }]);
    setAddMenuOpen(false);
  };

  // Removes an item from the sources list
  const removeSource = async (removePath: string) => {
    await sendDeleteRequest({ body: { path: removePath } });
    if (deleteError) return;
    setSources(sources.filter(x => x.path !== removePath));
  };

  // Handles closing the add menu
  const handleAddMenuClose = () => {
    if (addLoading) return;
    setAddMenuOpen(false);
  };

  return (
    <div className={classes.root}>
      {!sourcesLoading &&
        <div className={classes.list}>
          {sources.map(x =>
            <div className={classes.listItem} key={x.path}>
              <Typography className={classes.pathText}>{x.path}</Typography>
              <div className={classes.flexGrow} />
              <IconButton onClick={() => removeSource(x.path)}><CloseIcon /></IconButton>
            </div>
          )}
        </div>
      }
      <IconButton onClick={() => setAddMenuOpen(true)}>
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
            disabled={addLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddMenuClose} disabled={addLoading}>Cancel</Button>
          <Button onClick={addSource} disabled={addLoading}>Add</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SourceManager;