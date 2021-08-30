import { makeStyles, useMediaQuery, useTheme } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { VideoInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';
import useApiRequest from '../services/useApiRequest';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
}));

const MainPage: React.FC = () => {
  const classes = useStyles();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('xs'));

  const [session,] = useAtom(sessionAtom);
  const [videos, error, loading, sendRequest] = useApiRequest<VideoInformation[]>('/api/videos', 'get', null, true);

  useEffect(() => {
    sendRequest();
  }, []);

  // Redirects user to login if not logged in, otherwise returns main page content
  if (!session) return <Redirect to="/login" />;
  return (
    <div className={classes.root}>
      {videos?.map(x =>
        <VideoCard
          key={x.id}
          width={isSmallScreen ? '100%' : 300}
          id={x.id}
          title={x.title}
          channel={x.channelResponse.name}
          channelId={x.channelResponse.id}
        />
      )}
    </div>
  );
};

export default MainPage;
