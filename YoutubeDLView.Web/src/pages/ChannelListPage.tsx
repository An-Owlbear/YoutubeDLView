import { CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ChannelListItem from '../components/ChannelListItem';
import { ChannelInformation } from '../models/apiModels';
import { useApiRequest } from '../services/useApiRequest';

const useStyles = makeStyles(theme => ({
  channels: {
    width: '100%',
    '& > *': {
      marginBottom: theme.spacing(2)
    }
  }
}));

const ChannelListPage: React.FC = () => {
  const classes = useStyles();

  const [channels, setChannels] = useState<ChannelInformation[]>([]);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const [error, loading, sendRequest] = useApiRequest<ChannelInformation[]>('/api/channels', 'get', true, { params: { skip } });

  useEffect(() => {
    const loadChannels = async () => {
      const response = await sendRequest();
      if (!response) return;
      if (response.length < 30) setMaxLoaded(true);
      setChannels([...channels, ...response]);
    };
    loadChannels();
  }, [skip]);

  return (
    <>
      <div className={classes.channels}>
        {
          channels.map(x =>
            <ChannelListItem
              key={x.id}
              id={x.id}
              name={x.name}
            />
          )
        }
      </div>
      {loading && <CircularProgress />}
    </>
  );
};

export default ChannelListPage;