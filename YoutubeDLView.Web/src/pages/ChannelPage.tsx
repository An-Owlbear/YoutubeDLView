import { Avatar, Button, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles(theme => ({
  channelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4)
  },
  avatar: {
    height: 80,
    width: 80,
    fontSize: '2.5rem',
    marginRight: theme.spacing(3)
  },
  videos: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  }
}));

const ChannelPage: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const [session,] = useAtom(sessionAtom);

  const channelRequest = useRequest(() => HttpClient.GetChannel(id), [id]);

  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const videosRequest = useRequest(() => HttpClient.GetChannelVideos(id, skip), [id, skip], { keepPrevious: true, enabled: false });

  // Loads channel videos
  useEffect(() => {
    // Doesn't run if channel is not loaded
    if (!channelRequest.data) return;
    const loadVideos = async () => {
      const response = await videosRequest.refetch();
      if (!response.success || !response.data) return;
      if (response.data.length < 30) setMaxLoaded(true);
    };
    loadVideos();
  }, [channelRequest.data, skip]);

  // Loads the next page of videos
  const handleLoadButton = () => {
    setSkip(prevState => prevState + 30);
  };

  if (!session) return <Redirect to="/" />;
  return (
    <>
      {channelRequest.isLoading && <CircularProgress />}
      {!channelRequest.isLoading && channelRequest.data &&
        <div className={classes.channelHeader}>
          <Avatar className={classes.avatar}>{channelRequest.data.name.charAt(0)}</Avatar>
          <Typography variant="h4">{channelRequest.data.name}</Typography>
        </div>
      }
      {videosRequest.data &&
        <div className={classes.videos}>
          {
            videosRequest.data.map(x =>
              <VideoCard
                key={x.id}
                id={x.id}
                title={x.title}
                channelId={x.channel.id}
                channel={x.channel.name}
              />
            )
          }
        </div>
      }
      {videosRequest.isLoading && <CircularProgress />}
      {!videosRequest.isLoading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default ChannelPage;