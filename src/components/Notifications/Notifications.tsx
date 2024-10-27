import { Alert, Snackbar } from '@mui/material';
import { useAppStateSelectors } from '../../store/selectors';
import { Notification } from '../../types/index';
import { useDispatch } from '../../store/dispatch';
import { removeNotification } from '../../store/actions';

export function Notifications() {
  const { notifications } = useAppStateSelectors();
  const { dispatch } = useDispatch();

  const handleCloseNotification = (notification: Notification) => {
    if (notification.handleClose) {
      notification.handleClose();
    }
    dispatch(removeNotification(notification.id));
  };

  const notification = notifications[0];

  return (
    notification && (
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        open
        autoHideDuration={6000}
        onClose={() => handleCloseNotification(notification)}
        key={notification.id}
      >
        <Alert
          onClose={() => handleCloseNotification(notification)}
          severity={notification.type || 'success'}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    )
  );
}
