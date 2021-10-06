import { Avatar, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import React from 'react';
import { Link } from 'react-router-dom';

interface ChannelListItemProps {
  id: string;
  name: string;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    "& > *": {
      textDecoration: 'none'
    }
  },
  avatar: {
    height: 50,
    width: 50,
    fontSize: '1.5rem',
    marginRight: theme.spacing(2)
  }
}));

const ChannelListItem: React.FC<ChannelListItemProps> = (props: ChannelListItemProps) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Avatar className={classes.avatar} component={Link} to={`/channels/${props.id}`}>{props.name.charAt(0)}</Avatar>
      <Typography variant="h5" color="textPrimary" component={Link} to={`/channels/${props.id}`}>{props.name}</Typography>
    </div>
  );
};

export default ChannelListItem;