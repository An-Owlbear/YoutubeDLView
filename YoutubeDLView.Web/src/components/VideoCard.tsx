import { Avatar, styled, Typography, TypographyProps } from '@mui/material';
import React, { ComponentType } from 'react';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  title: string;
  channel: string;
  channelId: string;
}

const Root = styled('div')(({ theme }) => ({
  padding: theme.spacing(1),
  width: 300,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const ThumbnailContainer = styled(Link)(({ theme }) => ({
  display: 'block',
  paddingBottom: '56.25%',
  height: 0,
  position: 'relative',
  marginBottom: theme.spacing(1)
}));

const Thumbnail = styled('img')(() => ({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0
}));

const VideoInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  '& :first-child': {
    marginRight: theme.spacing(2)
  },
  '& > *': {
    textDecoration: 'none'
  }
}));

const VideoTextInfo = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  overflowX: 'hidden',
  '& > *': {
    textDecoration: 'none'
  }
}));

const VideoTitle = styled<ComponentType<TypographyProps<React.ElementType, { component: React.ElementType }>>>(Typography)(() => ({
  display: '-webkit-box',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  webkitLineClamp: 2,
  webkitBoxOrient: 'vertical'
}));

const VideoCard: React.FC<VideoCardProps> = (props: VideoCardProps) => {
  return (
    <Root>
      <ThumbnailContainer to={`/videos/${props.id}`}>
        <Thumbnail src={`/api/videos/${props.id}/thumbnail`} alt="" />
      </ThumbnailContainer>
      <VideoInfo>
        <Avatar component={Link} to={`/channels/${props.channelId}`}>{props.channel.charAt(0)}</Avatar>
        <VideoTextInfo>
          <VideoTitle variant="body1" color="textPrimary" component={Link} to={`/videos/${props.id}`}>{props.title}</VideoTitle>
          <Typography variant="body2" color="textSecondary" component={Link} to={`/channels/${props.channelId}`}>{props.channel}</Typography>
        </VideoTextInfo>
      </VideoInfo>
    </Root>
  );
};

export default VideoCard;