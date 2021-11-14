import { Button, styled } from '@mui/material';
import React from 'react';
import HttpClient from '../services/HttpClient';
import { useRequest } from '../services/useRequest';

const Setting = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2)
}));

const GeneralAdminSettings: React.FC = () => {
  const rescanRequest = useRequest(HttpClient.scanVideos, [], { enabled: false });

  return (
    <div>
      <Setting>
        <p>Check video sources and update library</p>
        <Button variant="contained" onClick={rescanRequest.refetch} disabled={rescanRequest.isLoading}>Refresh sources</Button>
      </Setting>
    </div>
  );
};

export default GeneralAdminSettings;