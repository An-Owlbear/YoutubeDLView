import { Alert, Snackbar } from '@mui/material';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { snackbarAtom } from '../services/globalStore';

const SnackbarDisplay: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [snackbarData] = useAtom(snackbarAtom);

  useEffect(() => {
    if (snackbarData.message) setOpen(true);
  }, [snackbarData.message]);

  return (
    <Snackbar open={open} onClose={() => setOpen(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={() => setOpen(false)} severity={snackbarData.type} variant="filled" sx={{ width: '100%' }}>
        {snackbarData.message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarDisplay;