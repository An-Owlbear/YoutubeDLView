import { styled } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { Redirect } from 'react-router-dom';
import SourceManager from '../components/SourceManager';
import { sessionAtom } from '../services/globalStore';

const Root = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: 450,
  padding: theme.spacing(2),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.down('sm')]: {
    width: '100%'
  }
}));

const SetupPage: React.FC = () => {
  const [session,] = useAtom(sessionAtom);

  if (!session) return <Redirect to="/" />;
  return (
    <Root>
      <SourceManager />
    </Root>
  );
};

export default SetupPage;