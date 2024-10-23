import { useState } from 'react';
import { Subscription } from '../../types';
import styles from './StorePage.module.css';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';

const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    power: 101,
    crystals: 256,
    details:
      'Subscribe to the flipout weekly pack and receive game resources daily',
    currency: 25,
    tonCurrency: 15,
    frequency: 'per day',
  },
];

export default function StorePage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  return (
    <div className={styles.store}>
      <div className={styles.subscriptions}>
        <Subscriptions subscriptions={subscriptions} />
      </div>
    </div>
  );
}
