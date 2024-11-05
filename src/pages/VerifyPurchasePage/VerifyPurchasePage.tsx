import { CheckCircle, Error } from '@material-ui/icons';
import { Box, CircularProgress, Fade } from '@mui/material';
import classnames from 'classnames';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../../components/Button/Button';
import { useInterval } from '../../hooks/useIntercall';
import { useStoreApi } from '../../hooks/useStoreApi';
import { GenericProps, PurchaseStatus } from '../../types';
import styles from './VerifyPurchasePage.module.css';

interface RequestResultProps extends GenericProps {
  title: string;
  message: string;
}

const purchaseErrors: Record<string, string> = {
  [PurchaseStatus.FAILED]: 'Payment failed',
  [PurchaseStatus.CLOSE]: 'Order was closed',
  [PurchaseStatus.DELAY_FAILED]: 'Payment was delayed and then failed',
  [PurchaseStatus.TIMEOUT]: 'Order timeout',
};

function RequestResult({ children, title, message }: RequestResultProps) {
  return (
    <Box
      display="flex"
      width="100%"
      height="100%"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      flexGrow={1}
      gap="10px"
    >
      <Box>{children}</Box>
      <Box display="flex" justifyContent="center" className={styles.title}>
        {title}
      </Box>
      <Box className={styles.message}>{message}</Box>
    </Box>
  );
}

export default function VerifyPurchasePage() {
  const [status, setStatus] = useState<PurchaseStatus>(PurchaseStatus.PENDING);
  const [searchParams] = useSearchParams();
  const { requestPaymenStatus } = useStoreApi();

  const isSuccessfull = useMemo(
    () =>
      status === PurchaseStatus.COMPLETED ||
      status === PurchaseStatus.DELAY_SUCCESS,
    [status]
  );

  const isLoading = useMemo(
    () =>
      status === PurchaseStatus.PENDING ||
      status === PurchaseStatus.INIT ||
      status === PurchaseStatus.PROCESSING,
    [status]
  );

  const isFailed = useMemo(
    () => !isLoading && !isSuccessfull,
    [isSuccessfull, isLoading]
  );

  const clickTryAgain = () => {
    if (parent.closeIframe) {
      parent.closeIframe();
    }
  };

  const clickClose = () => {
    if (parent.closeIframe) {
      parent.closeIframe();
    }
  };

  const getStatus = (orderId: string) =>
    requestPaymenStatus(orderId).then(
      ({ data: { purchaseStatus } }) => {
        if (purchaseStatus !== PurchaseStatus.PENDING) {
          setStatus(purchaseStatus);
        }
      },
      (e) => {
        console.error(e?.message || 'Something went wrong.');
      }
    );

  useEffect(() => {
    const orderId = searchParams.get('orderId');

    if (orderId) {
      getStatus(orderId);
    }
  }, []);

  useInterval(
    () => {
      const orderId = searchParams.get('orderId');

      if (orderId) {
        getStatus(orderId);
      }
    },
    isLoading ? 5000 : null
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      className={styles.background}
    >
      {isSuccessfull && (
        <RequestResult
          title="Product purchased successfully"
          message="And already sent to your inventory"
        >
          <>
            <CheckCircle
              style={{ width: '68px', height: '68px' }}
              className={styles.success}
            />
          </>
        </RequestResult>
      )}
      {isFailed && (
        <RequestResult
          title="The was an error when purchasing"
          message={purchaseErrors[status] || 'Please contact support'}
        >
          <>
            <Error
              style={{ width: '68px', height: '68px' }}
              className={styles.error}
            />
          </>
        </RequestResult>
      )}
      {isLoading && (
        <Fade in>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            className={styles.loader}
            gap="15px"
          >
            <CircularProgress color="inherit" />
            {status === PurchaseStatus.INIT && (
              <Box width="80%" textAlign="center">
                Purchase was inititialized. Please finish your payment.
              </Box>
            )}
            {status === PurchaseStatus.PROCESSING && (
              <Box width="80%" textAlign="center">
                Purchase is processing. Please wait.
              </Box>
            )}
          </Box>
        </Fade>
      )}
      {!isLoading && (
        <Box display="flex" flexDirection="column" gap="10px" width="100%">
          <Button
            className={classnames(styles.successBackground, styles.button)}
            handleClick={clickTryAgain}
          >
            {isSuccessfull ? 'back to flipout' : 'try again'}
          </Button>

          <Button className={styles.button} handleClick={clickClose}>
            close
          </Button>
        </Box>
      )}
    </Box>
  );
}
