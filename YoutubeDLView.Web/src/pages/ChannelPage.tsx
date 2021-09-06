import { Avatar, Button, CircularProgress, makeStyles, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { ChannelInformation, VideoInformation } from '../models/apiModels';
import { useApiRequest } from '../services/useApiRequest';

interface ChannelPageParams {
  id: string;
}

type ChannelPageProps = RouteComponentProps<ChannelPageParams>;

const useStyles = makeStyles(theme => ({
  channelHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing(4)
  },
  avatar: {
    height: 80,
    width: 80,
    fontSize: '2.5rem',
    marginRight: theme.spacing(3)
  },
  videos: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: theme.spacing(2)
  }
}));

const ChannelPage: React.FC<ChannelPageProps> = (props: ChannelPageProps) => {
  const classes = useStyles();

  const [channel, setChannel] = useState<ChannelInformation | null>(null);
  const [channelError, channelLoading, sendChannelRequest] = useApiRequest<ChannelInformation>(`/api/channels/${props.match.params.id}`, 'get', true);

  const [videos, setVideos] = useState<VideoInformation[]>([]);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const [videosError, videosLoading, sendVideoRequest] = useApiRequest<VideoInformation[]>(`/api/channels/${props.match.params.id}/videos`, 'get', true, { params: { skip } });

  // Loads channel information
  useEffect(() => {
    const loadChannelInfo = async () => {
      const response = await sendChannelRequest();
      setChannel(response);
    };
    loadChannelInfo();
  }, []);

  // Loads channel videos
  useEffect(() => {
    // Doesn't run if channel is not loaded
    if (!channel) return;
    const loadVideos = async () => {
      const response = await sendVideoRequest();
      if (!response) return;
      if (response.length < 30) setMaxLoaded(true);
      setVideos([...videos, ...response]);
    };
    loadVideos();
  }, [channel, skip]);

  // Loads the next page of videos
  const handleLoadButton = () => {
    setSkip(prevState => prevState + 30);
  };

  return (
    <>
      {channelLoading && <CircularProgress />}
      {!channelLoading && channel &&
        <div className={classes.channelHeader}>
          <Avatar className={classes.avatar}>{channel.name.charAt(0)}</Avatar>
          <Typography variant="h4">{channel.name}</Typography>
        </div>
      }
      {
        <div className={classes.videos}>
          {
            videos.map(x =>
              <VideoCard
                key={x.id}
                id={x.id}
                title={x.title}
                channelId={x.channelResponse.id}
                channel={x.channelResponse.name}
              />
            )
          }
        </div>
      }
      {videosLoading && <CircularProgress />}
      {!videosLoading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default ChannelPage;