import { Outlet, useNavigate } from 'react-router-dom';
import Header from '../Header/Header';
import styles from './Layout.module.css';
import { useAppStateSelectors } from '../../store/selectors';
import { Box, CircularProgress, Fade } from '@mui/material';
import { Notifications } from '../Notifications/Notifications';
import { useEffect } from 'react';
import { detectBrowser } from '../../utils/browser';
import { Browser } from '../../types';
import { AppRoutes } from '../../routes/routes';

export default function Layout() {
  const { isAppLoading } = useAppStateSelectors();
  const navigate = useNavigate();

  useEffect(() => {
    const browser = detectBrowser();
    if (browser === Browser.UNKNOWN_BROWSER) {
      navigate(AppRoutes.ROOT + AppRoutes.FORBIDDEN_BROWSER);
    }
  }, []);

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
