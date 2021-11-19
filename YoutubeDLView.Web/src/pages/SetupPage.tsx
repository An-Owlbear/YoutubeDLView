import { Button, styled } from '@mui/material';
import { useAtom } from 'jotai';
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import SourceManager from '../components/SourceManager';
import { FlexGrow } from '../components/commonStlyed';
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

const BottomContainer = styled('div')(() => ({
  display: 'flex',
  width: '100%'
}));

const SetupPage: React.FC = () => {
  const [session,] = useAtom(sessionAtom);

  if (!session) return <Navigate to="/" />;
  return (
    <Root>
      <SourceManager />
      <BottomContainer>
        <FlexGrow />
        <Button variant="contained" component={Link} to="/">Done</Button>
      </BottomContainer>
    </Root>
  );
};

export default SetupPage;