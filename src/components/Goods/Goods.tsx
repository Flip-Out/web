import { useStoreApi } from '../../hooks/useStoreApi';
import { addNotification, updateLoadingState } from '../../store/actions';
import { useDispatch } from '../../store/dispatch';
import { GenericProps, Good, PurchaseType } from '../../types';
import { PayButton } from '../Button/PayButton';
import { Card } from '../Card/Card';
import styles from './Goods.module.css';

interface GoodsProps extends GenericProps {
  goods: Array<Good>;
}

export function Goods({ goods }: GoodsProps) {
  const { createOrder } = useStoreApi();
  const { dispatch } = useDispatch();

  const buyGood = (currency: number) => {
    const amount = currency + '00';
    dispatch(updateLoadingState(true));
    createOrder({ purchase_type: PurchaseType.SINGLE_PAYMENT, amount }).then(
      () => {
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
        <div>{good.description}</div>
        <img src={good.image || 'good-placeholder.png'} alt="good" />
        <PayButton
          tonCurrency={good.tonCurrency}
          currency={good.currency}
          handleClick={() => buyGood(good.currency)}
        />
      </div>
    </Card>
  ));
}
