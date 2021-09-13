import { makeStyles } from '@material-ui/core';
import React from 'react';
import SourceManager from '../components/SourceManager';

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

  return (
    <div className={classes.root}>
      <SourceManager />
    </div>
  );
};

export default SetupPage;