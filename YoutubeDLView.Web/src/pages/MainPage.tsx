import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useList } from '../services/useList';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  },
}));

const MainPage: React.FC = () => {
  const classes = useStyles();

  const [session,] = useAtom(sessionAtom);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const { error, isLoading, data } = useRequest(() => HttpClient.getVideos(skip), [skip]);
  const videos = useList(data);

  useEffect(() => {
    if (data && data.length > 30) setMaxLoaded(true);
  }, [data]);

  const handleLoadButton = () => {
    setSkip(prevState => prevState + 30);
  };

  // Redirects user to login if not logged in, otherwise returns main page content
  if (!session) return <Redirect to="/login" />;
  return (
    <>
      <div className={classes.root}>
        {
          videos.map(x =>
            <VideoCard
              key={x.id}
              id={x.id}
              title={x.title}
              channel={x.channel.name}
              channelId={x.channel.id}
            />
          )
        }
      </div>
      {isLoading && <CircularProgress />}
      {!isLoading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default MainPage;
