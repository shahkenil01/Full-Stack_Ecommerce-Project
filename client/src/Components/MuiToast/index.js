import { SnackbarProvider, useSnackbar } from 'notistack';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Fade from '@mui/material/Fade';

const SnackbarCloseButton = ({ snackbarKey }) => {
  const { closeSnackbar } = useSnackbar();

  return (
    <IconButton className='closeicon' onClick={() => closeSnackbar(snackbarKey)} color="inherit">
      <CloseIcon className='closeicon'/>
    </IconButton>
  );
};

const NotistackProvider = ({ children }) => (
  <SnackbarProvider maxSnack={6} autoHideDuration={3000} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} 
    TransitionComponent={Fade} action={(key) => <SnackbarCloseButton snackbarKey={key} />} >
    {children}
  </SnackbarProvider>
);

export default NotistackProvider;