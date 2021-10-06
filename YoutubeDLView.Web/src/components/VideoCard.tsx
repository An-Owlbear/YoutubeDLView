import { Avatar, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';

interface VideoCardProps {
  id: string;
  title: string;
  channel: string;
  channelId: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(1),
    width: 300,
    [theme.breakpoints.down('sm')]: {
      width: '100%'
    }
  },
  thumbnailContainer: {
    display: 'block',
    paddingBottom: '56.25%',
    height: 0,
    position: 'relative',
    marginBottom: theme.spacing(1)
  },
  thumbnail: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0
  },
  videoInfo: {
    display: 'flex',
    flexDirection: 'row',
    '& :first-child': {
      marginRight: theme.spacing(2)
    },
    '& > *': {
      textDecoration: 'none'
    }
  },
  videoTextInfo: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    overflowX: 'hidden',
    '& > *': {
      textDecoration: 'none'
    }
  },
  videoTitle: {
    display: '-webkit-box',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    lineClamp: 2,
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical'
  }
}));

const VideoCard: React.FC<VideoCardProps> = (props: VideoCardProps) => {
  const classes = useStyles(props);

  return (
    <div className={classes.root}>
      <Link className={classes.thumbnailContainer} to={`/videos/${props.id}`}>
        <img src={`/api/videos/${props.id}/thumbnail`} className={classes.thumbnail}  alt="" />
      </Link>
      <div className={classes.videoInfo}>
        <Avatar component={Link} to={`/channels/${props.channelId}`}>{props.channel.charAt(0)}</Avatar>
        <div className={classes.videoTextInfo}>
          <Typography variant="body1" color="textPrimary" component={Link} to={`/videos/${props.id}`} className={classes.videoTitle}>{props.title}</Typography>
          <Typography variant="body2" color="textSecondary" component={Link} to={`/channels/${props.channelId}`}>{props.channel}</Typography>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;