import { Avatar, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

interface VideoCardProps {
  width: number;
  id: string;
  title: string;
  channel: string;
  channelId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width: (props: VideoCardProps) => props.width
  },
  thumbnail: {
    width: '100%',
    height: (props: VideoCardProps) => props.width * (9/16),
    marginBottom: theme.spacing(1)
  },
  videoInfo: {
    display: 'flex',
    flexDirection: 'row',
    '& :first-child': {
      marginRight: theme.spacing(2)
    }
  },
  videoTextInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
}));

const VideoCard: React.FC<VideoCardProps> = (props: VideoCardProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <img src={`/videos/${props.id}/thumbnail`} className={classes.thumbnail}  alt="" />
      <div className={classes.videoInfo}>
        <Avatar>{props.channel.charAt(0)}</Avatar>
        <div className={classes.videoTextInfo}>
          <Typography variant="body1">{props.title}</Typography>
          <Typography variant="body2" color="textSecondary">{props.channel}</Typography>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;