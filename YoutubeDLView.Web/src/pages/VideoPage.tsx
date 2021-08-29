import { makeStyles, Typography } from '@material-ui/core';
import axios, { AxiosError } from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { VideoInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';

interface VideoPageParams {
  id: string;
}

type VideoPageProps = RouteComponentProps<VideoPageParams>;


const useStyles = makeStyles((theme) => ({
  root: {
    width: '70%'
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    height: 0,
    marginBottom: theme.spacing(2)
  },
  video: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  }
}));

const VideoPage: React.FC<VideoPageProps> = (props: VideoPageProps) => {
  const classes = useStyles();

  const [video, setVideo] = useState<VideoInformation | null>(null);
  const [session,] = useAtom(sessionAtom);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const response = await axios.get(`/videos/${props.match.params.id}`, { headers: { 'Authorization': `Bearer ${session?.accessToken}` } });
        const data: VideoInformation = response.data;
        setVideo(data);
      } catch (error) {
        const errorMessage = (error as AxiosError).response?.data;
        console.log(errorMessage);
      }
    };
    getVideo();
  }, []);

  return (
    <div className={classes.root}>
      {
        !!video &&
        <>
          <div className={classes.videoContainer}>
            <video className={classes.video} controls autoPlay>
              <source src={`/videos/${video.id}/video`} type="video/webm" />
            </video>
          </div>
          <Typography variant="h5">{video.title}</Typography>
        </>
      }
    </div>
  );

};

export default VideoPage;