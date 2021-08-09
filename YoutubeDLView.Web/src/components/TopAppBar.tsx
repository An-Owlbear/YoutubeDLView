import { AppBar, Button, Toolbar, Theme, Typography, makeStyles, createStyles } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    spacer: {
      flexGrow: 1
    }
  })
);

const TopAppBar: React.FC = () => {
  const classes = useStyles();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6">YoutubeDLView</Typography>
        <div className={classes.spacer} />
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  )
}

export default TopAppBar;