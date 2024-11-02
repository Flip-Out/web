import { Box } from '@mui/material';
import styles from './ForbiddenBrowserPage.module.css';

export default function ForbiddenBrowserPage() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={styles.background}
    ></Box>
  );
}
