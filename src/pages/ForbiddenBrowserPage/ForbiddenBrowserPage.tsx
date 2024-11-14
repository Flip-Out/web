import { Box } from '@mui/material';
import styles from './ForbiddenBrowserPage.module.css';
import Logo from '../../assets/Logo';
import { Button } from '../../components/Button/Button';
import Chrome from '../../assets/Chrome';
import { copyToClipboard, isIOS } from '../../utils/browser';
import Safari from '../../assets/Safari';
import { AppRoutes } from '../../routes/routes';

export default function ForbiddenBrowserPage() {
  const copyLink = () => {
    const link = window.location.origin + AppRoutes.ROOT + AppRoutes.STORE;
    copyToClipboard(link);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={styles.background}
    >
      <div className={styles.header}>
        <Logo />
      </div>
      <Box
        flexGrow="1"
        display="flex"
        flexDirection="column"
        justifyContent="flex-end"
        alignItems="center"
      >
        <Box textAlign="center" marginBottom="30px">
          <span>
            Hello 👋, unfortunately we are currently unable to process your
            request in the Telegram browser.
          </span>
        </Box>
        <Box
          textAlign="center"
          fontSize="20px"
          fontWeight="500"
          marginBottom="70px"
        >
          <span>To use the store, open the link in:</span>
          {isIOS() ? (
            <Box display="flex" justifyContent="center" gap="5px">
              <Safari />
              <span>Safari</span>
            </Box>
          ) : (
            <Box display="flex" justifyContent="center" gap="5px">
              <Chrome />
              <span>Chrome</span>
            </Box>
          )}
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          gap="15px"
          textAlign="center"
          marginBottom="50px"
        >
          <span>Or copy the link to use in your desired browser</span>
          <Button handleClick={copyLink} className={styles.button}>
            <>
              <span>copy link</span>
            </>
          </Button>
        </Box>
        <Box className={styles.footer}>Flip Out. 2024</Box>
      </Box>
    </Box>
  );
}
