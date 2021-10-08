import { Avatar, styled, Typography } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom';

interface ChannelListItemProps {
  id: string;
  name: string;
}

const Root = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  '& > *': {
    textDecoration: 'none'
  }
}));

const ChannelListItem: React.FC<ChannelListItemProps> = (props: ChannelListItemProps) => {
  return (
    <Root>
      <Avatar sx={{ height: 50, width: 50, fontSize: '1.5rem', marginRight: 2 }} component={Link} to={`/channels/${props.id}`}>{props.name.charAt(0)}</Avatar>
      <Typography variant="h5" color="textPrimary" component={Link} to={`/channels/${props.id}`}>{props.name}</Typography>
    </Root>
  );
};

export default ChannelListItem;