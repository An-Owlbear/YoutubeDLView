import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Redirect } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { VideoInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';
import { useApiRequest } from '../services/useApiRequest';

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
  const [videos, setVideos] = useState<VideoInformation[]>([]);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const queryParams = useMemo(() => ({skip, take: 30}), [skip]);
  const [error, loading, sendRequest] = useApiRequest<VideoInformation[]>('/api/videos', 'get', true, { params: queryParams } );

  // Loads frontpage video
  useEffect(() => {
    const loadVideos = async () => {
      const response = await sendRequest();
      if (!response) return;
      if (response.length < 30) setMaxLoaded(true);
      setVideos([...videos, ...response]);
    };
    loadVideos();
  }, [skip]);

  const handleLoadButton = () => {
    setSkip(prevState => prevState + 30);
  };

  // Redirects user to login if not logged in, otherwise returns main page content
  if (!session) return <Redirect to="/login" />;
  return (
    <>
      <div className={classes.root}>
        {
          videos?.map(x =>
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
      {loading && <CircularProgress />}
      {!loading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default MainPage;
