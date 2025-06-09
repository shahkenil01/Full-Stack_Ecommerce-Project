import React from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarCloseButton = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton onClick={() => closeSnackbar(snackbarKey)} color="inherit">
      <CloseIcon />
    </IconButton>
  );
};

const NotistackProvider = ({ children }) => (
  <SnackbarProvider maxSnack={6} autoHideDuration={3000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} TransitionProps={{ direction: 'left' }}
    action={(key) => <SnackbarCloseButton snackbarKey={key} />} >
    {children}
  </SnackbarProvider>
);

export default NotistackProvider;