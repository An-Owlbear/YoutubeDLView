import { Avatar, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { useAtom } from 'jotai';
import React from 'react';
import { Link, Redirect, useParams } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { convertShortYTDate } from '../services/dateUtils';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

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

const VideoPage: React.FC = () => {
  const classes = useStyles();

  const { id } = useParams<{ id: string }>();
  const [session,] = useAtom(sessionAtom);
  const { error, isLoading, data } = useRequest(() => HttpClient.GetVideo(id), [id]);

  if (!session) return <Redirect to="/login" />;
  return (
    <>
      {isLoading && <CircularProgress/>}
      {!isLoading && data &&
        <div className={classes.root}>
          <div className={classes.videoContainer}>
            <video className={classes.video} controls autoPlay preload="none" playsInline>
              <source src={`/api/videos/${data.id}/video`} type="video/webm"/>
            </video>
          </div>
          <Typography className={classes.title} variant="h5">{data.title}</Typography>
          <Typography variant="body1" color="textSecondary">Uploaded {convertShortYTDate(data.uploadDate)}</Typography>
          <div className={classes.channelContainer}>
            <Avatar component={Link} to={`/channels/${data.channel.id}`}>{data.channel.name.charAt(0)}</Avatar>
            <Typography variant="h6" color="textPrimary" component={Link} to={`/channels/${data.channel.id}`}>{data.channel.name}</Typography>
          </div>
          <Typography className={classes.description} variant="body1">{data.description}</Typography>
        </div>
      }
    </>
  );

};

export default VideoPage;