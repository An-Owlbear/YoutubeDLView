import { makeStyles } from '@material-ui/core';
import axios, { AxiosError } from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { VideoInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center'
  }
}));

const MainPage: React.FC = () => {
  const classes = useStyles();

  const [session,] = useAtom(sessionAtom);
  const [videos, setVideos] = useState<VideoInformation[]>([]);

  // Loads the videos for the frontpage
  useEffect(() => {
    const loadVideos = async () => {
      try {
        const response = await axios.get('/Videos');
        const data: VideoInformation[] = response.data;
        setVideos(data);
      } catch (error) {
        const errorMessage = (error as AxiosError).response?.data;
        console.log(errorMessage);
      }
    };
    loadVideos();
  }, []);

  // Redirects user to login if not logged in, otherwise returns main page content
  if (!session) return <Redirect to="/login"/>;
  return (
    <div className={classes.root}>
      {videos.map(x =>
        <VideoCard
          key={x.id}
          width={300}
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
