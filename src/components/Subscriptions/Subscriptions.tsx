import { GenericProps, Subscription } from '../../types';
import { PayButton } from '../Button/PayButton';
import { Card } from '../Card/Card';
import { Currency } from '../Currency/Currency';
import styles from './Subscriptions.module.css';

interface SubscriptionProps extends GenericProps {
  subscriptions: Array<Subscription>;
}

export function Subscriptions({ subscriptions }: SubscriptionProps) {
  const subscribe = () => {
    console.log('subscribe');
  };

  return subscriptions.map((subscription, index) => (
    <Card className={styles.subscription} key={index}>
      <div className={styles.subscriptionWrapper}>
        <div className={styles.details}>{subscription.details}</div>
        <div className={styles.currencyWrapper}>
          <div className={styles.currency}>
            <Currency
              power={subscription.power}
              crystals={subscription.crystals}
              direction="revert"
              className={styles.currencyDetails}
            />
            / {subscription.frequency}
          </div>
          <PayButton
            currency={subscription.currency}
            tonCurrency={subscription.tonCurrency}
            handleClick={subscribe}
          />
        </div>
      </div>
    </Card>
  ));
}
