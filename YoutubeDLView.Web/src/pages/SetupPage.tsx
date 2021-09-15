import { makeStyles } from '@material-ui/core';
import { useAtom } from 'jotai';
import React from 'react';
import { Redirect } from 'react-router-dom';
import SourceManager from '../components/SourceManager';
import { sessionAtom } from '../services/globalStore';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 450,
    padding: theme.spacing(2),
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    [theme.breakpoints.down('xs')]: {
      width: '100%'
    }
  }
}));

const SetupPage: React.FC = () => {
  const classes = useStyles();
  const [session,] = useAtom(sessionAtom);

  if (!session) return <Redirect to="/" />;
  return (
    <div className={classes.root}>
      <SourceManager />
    </div>
  );
};

export default SetupPage;