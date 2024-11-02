import { Box } from '@mui/material';
import { useStoreApi } from '../../hooks/useStoreApi';
import { addNotification, updateLoadingState } from '../../store/actions';
import { useDispatch } from '../../store/dispatch';
import { GenericProps, Good, PurchaseType } from '../../types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import styles from './Goods.module.css';
import InternalCurrency from '../../assets/InternalCurrency';
import TonCurrency from '../../assets/TonCurrency';

interface GoodsProps extends GenericProps {
  goods: Array<Good>;
  handleBuyInit: (url: string) => void;
}

export function Goods({ goods, handleBuyInit }: GoodsProps) {
  const { createOrder } = useStoreApi();
  const { dispatch } = useDispatch();

  const buyGood = (currency: number) => {
    const amount = currency + '00';
    dispatch(updateLoadingState(true));
    createOrder({ purchase_type: PurchaseType.SINGLE_PAYMENT, amount }).then(
      (data) => {
        handleBuyInit(data?.data.paymentLink || '');
        dispatch(updateLoadingState(false));
      },
      (e) =>
        dispatch(
          addNotification({
            message: e?.message || 'Something went wrong.',
            type: 'error',
          })
        )
    );
  };

  return goods.map((good, index) => (
    <Card className={styles.good} key={index}>
      <div className={styles.goodnWrapper}>
        <img
          src={good.image || 'good-placeholder.png'}
          alt="good"
          className={styles.image}
        />
        <Box
          display="flex"
          justifyContent="space-between"
          width="100%"
          height="100%"
          padding="0 10px"
          boxSizing="border-box"
        >
          <Box display="flex" flexDirection="column" gap="15px">
            <Box className={styles.description}>{good.description}</Box>
            <Box className={styles.price}>
              <div>{good.currency}</div>
              <InternalCurrency className={styles.payIcon} />
              <>/</>
              <div>{good.tonCurrency}</div>
              <TonCurrency className={styles.payIcon} />
            </Box>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            gap="5px"
          >
            <Box
              display="flex"
              justifyContent="center"
              className={styles.discount}
              style={{ visibility: good.discount ? 'visible' : 'hidden' }}
            >
              {good.discount}
            </Box>
            <Button
              className={styles.button}
              handleClick={() => buyGood(good.currency)}
            >
              buy
            </Button>
          </Box>
        </Box>
      </div>
    </Card>
  ));
}
