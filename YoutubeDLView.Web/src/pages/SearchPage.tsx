import { Button, CircularProgress, makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SearchVideo from '../components/SearchVideo';
import { VideoInformation } from '../models/apiModels';
import { useApiRequest } from '../services/useApiRequest';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '75%',
    marginBottom: theme.spacing(2),
    '& > *': {
      margin: theme.spacing(2, 0)
    },
    '& :first-child': {
      marginTop: 0
    }
  }
}));

const SearchPage: React.FC = () => {
  const classes = useStyles();
  const { search } = useParams<{ search: string }>();
  const [searchData, setSearchData] = useState({ search: search, skip: 0 });
  const [videos, setVideos] = useState<VideoInformation[]>([]);
  const [maxLoaded, setMaxLoaded] = useState(false);
  const [error, loading, sendRequest] = useApiRequest<VideoInformation[]>(
    `/api/search/${searchData.search}`,
    'get',
    true,
    { params: { skip: searchData.skip } }
  );

  // Changes search data when the search parameter changes
  useEffect(() => {
    setVideos([]);
    setMaxLoaded(false);
    setSearchData({ search: search, skip: 0 });
  }, [search]);

  // Loads search result
  useEffect(() => {
    const loadVideos = async () => {
      const response = await sendRequest();
      if (!response) return;
      if (response.length < 30) setMaxLoaded(true);
      setVideos([...videos, ...response]);
    };
    loadVideos();
  }, [searchData]);

  const handleLoadButton = () => {
    setSearchData(prevState => ({ ...prevState, skip: prevState.skip + 30 }));
  };

  return (
    <>
      <div className={classes.root}>
        {
          videos.map(x =>
            <SearchVideo key={x.id} video={x} />
          )
        }
      </div>
      {loading && <CircularProgress />}
      {!loading && !maxLoaded && <Button variant="contained" color="primary" onClick={handleLoadButton}>Load more</Button>}
    </>
  );
};

export default SearchPage;