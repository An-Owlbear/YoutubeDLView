import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { VideoInformation } from '../models/apiModels';
import { sessionAtom } from '../services/globalStore';
import { useApiRequest } from '../services/useApiRequest';

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

  const [session,] = useAtom(sessionAtom);
  const [video, setVideo] = useState<VideoInformation | null>(null);
  const [error, loading, sendRequest] = useApiRequest<VideoInformation>(`/api/videos/${props.match.params.id}`, 'get', true);

  useEffect(() => {
    const loadVideo = async () => {
      const response = await sendRequest();
      if (!response) return;
      setVideo(response);
    };
    loadVideo();
  }, []);

  if (!session) return <Redirect to="/login" />;
  return (
    <>
      {loading ?
        <CircularProgress/> :
        <div className={classes.root}>
          {video &&
          <>
            <div className={classes.videoContainer}>
              <video className={classes.video} controls autoPlay>
                <source src={`/api/videos/${video.id}/video`} type="video/webm"/>
              </video>
            </div>
            <Typography variant="h5">{video.title}</Typography>
          </>
          }
        </div>
      }
    </>
  );

};

export default VideoPage;