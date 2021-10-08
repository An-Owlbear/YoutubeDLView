import { Avatar, styled, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoInformation } from '../models/apiModels';

interface SearchVideoProps {
  video: VideoInformation
}

const Root = styled('div')(() => ({
  display: 'flex',
  height: 225
}));

const Thumbnail = styled('img')(() => ({
  width: 400,
  height: '100%'
}));

const VideoInfo = styled('div')(({ theme }) => ({
  marginLeft: theme.spacing(2),
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  '& > *': {
    margin: theme.spacing(0.5, 0),
    textDecoration: 'none'
  },
  '& :first-child': {
    marginTop: 0
  }
}));

const ChannelInfo = styled(Link)(() => ({
  display: 'flex',
  alignItems: 'center',
}));

const StyledAvatar = styled(Avatar)(() => ({ theme }) => ({
  width: 30,
  height: 30,
  fontSize: '0.9375rem',
  marginRight: theme.spacing(1)
}));

const DescriptionText = styled(Typography)(() => ({
  overflow: 'hidden',
  whiteSpace: 'pre-wrap',
  textOverflow: 'ellipsis'
}));

const SearchVideo: React.FC<SearchVideoProps> = (props: SearchVideoProps) => {
  return (
    <Root>
      <Link to={`/videos/${props.video.id}`}>
        <Thumbnail src={`/api/videos/${props.video.id}/thumbnail`} alt="" />
      </Link>
      <VideoInfo>
        <Typography variant="h6" color="textPrimary" component={Link} to={`/videos/${props.video.id}`}>{props.video.title}</Typography>
        <ChannelInfo to={`/channels/${props.video.channel.id}`}>
          <StyledAvatar>{props.video.channel.name.charAt(0)}</StyledAvatar>
          <Typography variant="body1" color="textSecondary">{props.video.channel.name}</Typography>
        </ChannelInfo>
        <DescriptionText variant="body2" color="textSecondary">{props.video.description}</DescriptionText>
      </VideoInfo>
    </Root>
  );
};

export default SearchVideo;