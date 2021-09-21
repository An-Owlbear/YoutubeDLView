import { CircularProgress, makeStyles } from '@material-ui/core';
import { useAtom } from 'jotai';
import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';
import ChannelListItem from '../components/ChannelListItem';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useRequest } from '../services/useRequest';

const useStyles = makeStyles(theme => ({
  channels: {
    width: '100%',
    '& > *': {
      marginBottom: theme.spacing(2)
    }
  }
}));

const ChannelListPage: React.FC = () => {
  const classes = useStyles();

  const [session,] = useAtom(sessionAtom);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const { error, isLoading, data } = useRequest(() => HttpClient.GetChannels(skip), [skip]);
  const previousDataLength = useRef(0);

  useEffect(() => {
    if (!data) return;
    if (data.length - previousDataLength.current < 30) setMaxLoaded(true);
    previousDataLength.current = data.length;
  }, [data]);

  if (!session) return <Redirect to="/login" />;
  return (
    <>
      <div className={classes.channels}>
        {data &&
          data.map(x =>
            <ChannelListItem
              key={x.id}
              id={x.id}
              name={x.name}
            />
          )
        }
      </div>
      {isLoading && <CircularProgress />}
    </>
  );
};

export default ChannelListPage;