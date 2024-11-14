import { Box, Button, Dialog, useMediaQuery, useTheme } from '@mui/material';
import styles from './AeonModal.module.css';
import { Close } from '@material-ui/icons';

interface AeonModalProps {
  open: boolean;
  url: string;
  title: string;
  onCLose?: () => void;
}

export function AeonModal({ open, onCLose, url, title }: AeonModalProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      fullScreen={fullScreen}
      aria-labelledby="responsive-dialog"
      maxWidth="sm"
      style={{ border: 'rgba(48, 238, 227, 0.2)' }}
    >
      <Box display="flex" flexDirection="column" className={styles.wrapper}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          color="white"
          padding="0px 10px"
        >
          <span className={styles.title}>{title}</span>
          <Button onClick={onCLose} color="inherit">
            <Close color="inherit" />
          </Button>
        </Box>
        <Box display="flex" flexGrow={1}>
          <iframe src={url} className={styles.iframe} />
        </Box>
      </Box>
    </Dialog>
  );
}
