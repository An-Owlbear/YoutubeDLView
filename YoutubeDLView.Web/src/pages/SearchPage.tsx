import { Button, CircularProgress, styled } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import SearchVideo from '../components/SearchVideo';
import HttpClient from '../services/HttpClient';
import { sessionAtom } from '../services/globalStore';
import { useList } from '../services/useList';
import { useRequest } from '../services/useRequest';

const Root = styled('div')(({ theme }) => ({
  width: '75%',
  marginBottom: theme.spacing(2),
  '& > *': {
    margin: theme.spacing(2, 0)
  },
  '& :first-child': {
    marginTop: 0
  }
}));

const SearchPage: React.FC = () => {
  const { search } = useParams<'search'>() as { search: string };
  const [session,] = useAtom(sessionAtom);
  const [skip, setSkip] = useState(0);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const { error, isLoading, data } = useRequest(() => HttpClient.searchVideos(search, skip), [search, skip]);
  const videos = useList(search, data);

  // Checks if all possible results are loaded
  useEffect(() => {
    if (data && data.length < 30) setMaxLoaded(true);
  }, [data]);

  const handleLoadButton = () => {
    setSkip(prevState => prevState + 30);
  };

  if (!session) return <Navigate to="/" />;
  return (
    <>
      <Root>
        {
          videos.map(x =>
            <SearchVideo key={x.id} video={x} />
          )
        }
      </Root>
      {isLoading && <CircularProgress />}
      {!isLoading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default SearchPage;