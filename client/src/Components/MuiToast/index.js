import react from 'react';
import { SnackbarProvider, useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const SnackbarCloseButton = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton className='closeicon' onClick={() => closeSnackbar(snackbarKey)} color="inherit">
      <CloseIcon className='closeicon'/>
    </IconButton>
  );
};

const NotistackProvider = ({ children }) => (
  <SnackbarProvider maxSnack={6} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    action={(key) => <SnackbarCloseButton snackbarKey={key} />} >
    {children}
  </SnackbarProvider>
);

export default NotistackProvider;