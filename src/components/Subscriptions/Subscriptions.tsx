import { useEffect, useState } from 'react';
import Cash from '../../assets/Cash';
import Crystals from '../../assets/Crystals';
import InternalCurrency from '../../assets/InternalCurrency';
import Power from '../../assets/Power';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps, PurchaseType, Subscription } from '../../types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import styles from './Subscriptions.module.css';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../../utils/localStorage';
import { useStoreApi } from '../../hooks/useStoreApi';
import { useDispatch } from '../../store/dispatch';
import { addNotification, updateLoadingState } from '../../store/actions';

interface SubscriptionProps extends GenericProps {
  subscriptions: Array<Subscription>;
  handleBuyInit: (url: string, title: string) => void;
}

export function Subscriptions({
  subscriptions,
  handleBuyInit,
}: SubscriptionProps) {
  const { createOrder } = useStoreApi();
  const { dispatch } = useDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const user = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
    setIsLoggedIn(!user);
  }, []);

  const subscribe = (subscription: Subscription) => {
    const amount = subscription.currency + '00';
    dispatch(updateLoadingState(true));
    createOrder({
      purchase_type: PurchaseType.SUBSCRIPTION,
      amount,
      purchaseId: subscription.id,
    }).then(
      (data) => {
        handleBuyInit(data?.data.paymentLink || '', subscription.details);
        dispatch(updateLoadingState(false));
      },
      (e) => {
        dispatch(
          addNotification({
            message: e?.message || 'Something went wrong.',
            type: 'error',
          })
        );
        dispatch(updateLoadingState(false));
      }
    );
  };

  return subscriptions.map((subscription, index) => (
    <Card className={styles.subscription} key={index}>
      <div className={styles.subscriptionWrapper}>
        <div className={styles.details}>
          <div className={styles.detailsTitle}>{subscription.details}</div>
          <div className={styles.additionalInfo}>
            <div>{subscription.additionalInfo}</div>
            <div className={styles.list}>
              <div className={styles.ability}>
                <Power className={styles.icon} />
                <div className={styles.pink}>+{subscription.xploit}</div>
              </div>
              <div className={styles.ability}>
                <Crystals className={styles.icon} />
                <div className={styles.orange}>+{subscription.chip}</div>
              </div>
              <div className={styles.ability}>
                <Cash className={styles.icon} />
                <div className={styles.turqouise}>+{subscription.items}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.currencyWrapper}>
          <div className={styles.currency}>
            <div>{subscription.currency}</div>
            <InternalCurrency className={styles.payIcon} />
            <>/</>
            <div>{subscription.tonCurrency}</div>
            <TonCurrency className={styles.payIcon} />
          </div>
          <Button
            handleClick={() => subscribe(subscription)}
            disabled={isLoggedIn}
          >
            subscribe
          </Button>
        </div>
      </div>
    </Card>
  ));
}
