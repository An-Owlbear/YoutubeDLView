import { Avatar, makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import { VideoInformation } from '../models/apiModels';

interface SearchVideoProps {
  video: VideoInformation
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    height: 225
  },
  thumbnail: {
    width: 400,
    height: '100%'
  },
  videoInfo: {
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
  },
  channelInfo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    fontSize: '0.9375rem',
    marginRight: theme.spacing(1)
  },
  description: {
    overflow: 'hidden',
    whiteSpace: 'pre-wrap',
    textOverflow: 'ellipsis'
  }
}));

const SearchVideo: React.FC<SearchVideoProps> = (props: SearchVideoProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Link to={`/videos/${props.video.id}`}>
        <img className={classes.thumbnail} src={`/api/videos/${props.video.id}/thumbnail`} alt="" />
      </Link>
      <div className={classes.videoInfo}>
        <Typography variant="h6" color="textPrimary" component={Link} to={`/videos/${props.video.id}`}>{props.video.title}</Typography>
        <Link className={classes.channelInfo} to={`/channels/${props.video.channel.id}`}>
          <Avatar className={classes.avatar}>{props.video.channel.name.charAt(0)}</Avatar>
          <Typography variant="body1" color="textSecondary">{props.video.channel.name}</Typography>
        </Link>
        <Typography className={classes.description} variant="body2" color="textSecondary">{props.video.description}</Typography>
      </div>
    </div>
  );
};

export default SearchVideo;