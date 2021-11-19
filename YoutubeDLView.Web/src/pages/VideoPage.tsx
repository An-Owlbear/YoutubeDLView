import { Avatar, CircularProgress, styled, Typography } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import HttpClient from '../services/HttpClient';
import { convertShortYTDate } from '../services/dateUtils';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const Root = styled('div')(() => ({
  width: '70%'
}));

const VideoContainer = styled('div')(({ theme }) => ({
  position: 'relative',
  paddingBottom: '56.25%',
  height: 0,
  marginBottom: theme.spacing(2)
}));

const Video = styled('video')(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0
}));

const ChannelContainer = styled('div')(({ theme }) => ({
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
}));

const VideoPage: React.FC = () => {
  const { id } = useParams<'id'>() as { id: string };
  const [session,] = useAtom(sessionAtom);
  const { error, isLoading, data } = useRequest(() => HttpClient.getVideo(id), [id]);

  if (!session) return <Navigate to="/login" />;
  return (
    <>
      {isLoading && <CircularProgress/>}
      {!isLoading && data &&
        <Root>
          <VideoContainer>
            <Video controls autoPlay preload="none" playsInline>
              <source src={`/api/videos/${data.id}/video`} type="video/webm"/>
            </Video>
          </VideoContainer>
          <Typography sx={{ marginBottom: 1 }} variant="h5">{data.title}</Typography>
          <Typography variant="body1" color="textSecondary">Uploaded {convertShortYTDate(data.uploadDate)}</Typography>
          <ChannelContainer>
            <Avatar component={Link} to={`/channels/${data.channel.id}`}>{data.channel.name.charAt(0)}</Avatar>
            <Typography variant="h6" color="textPrimary" component={Link} to={`/channels/${data.channel.id}`}>{data.channel.name}</Typography>
          </ChannelContainer>
          <Typography sx={{ whiteSpace: 'pre-wrap' }} variant="body1">{data.description}</Typography>
        </Root>
      }
    </>
  );

};

export default VideoPage;