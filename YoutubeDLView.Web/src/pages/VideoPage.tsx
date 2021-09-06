import { Avatar, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Link, Redirect, RouteComponentProps } from 'react-router-dom';
import { VideoInformation } from '../models/apiModels';
import { convertShortYTDate } from '../services/dateUtils';
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
  },
  title: {
    marginBottom: theme.spacing(1)
  },
  channelContainer: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    display: 'flex',
    alignItems: 'center',
    '& > :first-child': {
      marginRight: theme.spacing(2)
    },
    '& > *': {
      textDecoration: 'none'
    }
  },
  description: {
    whiteSpace: 'pre-wrap'
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
      {loading && <CircularProgress/>}
      {!loading && video &&
        <div className={classes.root}>
          <div className={classes.videoContainer}>
            <video className={classes.video} controls autoPlay preload="none" playsInline>
              <source src={`/api/videos/${video.id}/video`} type="video/webm"/>
            </video>
          </div>
          <Typography className={classes.title} variant="h5">{video.title}</Typography>
          <Typography variant="body1" color="textSecondary">Uploaded {convertShortYTDate(video.uploadDate)}</Typography>
          <div className={classes.channelContainer}>
            <Avatar component={Link} to={`/channels/${video.channelResponse.id}`}>{video.channelResponse.name.charAt(0)}</Avatar>
            <Typography variant="h6" color="textPrimary" component={Link} to={`/channels/${video.channelResponse.id}`}>{video.channelResponse.name}</Typography>
          </div>
          <Typography className={classes.description} variant="body1">{video.description}</Typography>
        </div>
      }
    </>
  );

};

export default VideoPage;