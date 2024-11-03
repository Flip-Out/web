import { useEffect, useState } from 'react';
import Cash from '../../assets/Cash';
import Crystals from '../../assets/Crystals';
import InternalCurrency from '../../assets/InternalCurrency';
import Power from '../../assets/Power';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps, Subscription } from '../../types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import styles from './Subscriptions.module.css';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../../utils/localStorage';

interface SubscriptionProps extends GenericProps {
  subscriptions: Array<Subscription>;
}

export function Subscriptions({ subscriptions }: SubscriptionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const user = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
    setIsLoggedIn(!user);
  }, []);

  const subscribe = () => {
    console.log('subscribe');
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
                <div className={styles.pink}>+{subscription.power}</div>
              </div>
              <div className={styles.ability}>
                <Crystals className={styles.icon} />
                <div className={styles.orange}>+{subscription.crystals}</div>
              </div>
              <div className={styles.ability}>
                <Cash className={styles.icon} />
                <div className={styles.turqouise}>+{subscription.cash}</div>
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
          <Button handleClick={subscribe} disabled={isLoggedIn}>
            subscribe
          </Button>
        </div>
      </div>
    </Card>
  ));
}
