import { Outlet } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import { useAppStateSelectors } from '../../store/selectors';
import { Box, CircularProgress, Fade } from '@mui/material';
import { Notifications } from '../Notifications/Notifications';

export default function Layout() {
  const { isAppLoading } = useAppStateSelectors();

  return (
    <div className={styles.content}>
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {isAppLoading && (
        <Fade in>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            className={styles.loader}
          >
            <CircularProgress color="inherit" />
          </Box>
        </Fade>
      )}
      <Notifications />
    </div>
  );
}
