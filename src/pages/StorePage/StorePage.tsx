import { useState } from 'react';
import { Good, Subscription } from '../../types';
import styles from './StorePage.module.css';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';
import { Goods } from '../../components/Goods/Goods';

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

const mockGoods: Good[] = [
  {
    id: 1,
    description: '10 xPloits',
    currency: 10,
    tonCurrency: 1.9,
    image: '',
  },
  {
    id: 2,
    description: '100 xPloits',
    currency: 100,
    tonCurrency: 19,
    image: '',
  },
  {
    id: 3,
    description: '500 xPloits',
    currency: 500,
    tonCurrency: 95,
    image: '',
  },
  {
    id: 4,
    description: '1,000 xPloits',
    currency: 1000,
    tonCurrency: 190,
    image: '',
  },
  {
    id: 5,
    description: '2,000 xPloits',
    currency: 2000,
    tonCurrency: 381,
    image: '',
  },
  {
    id: 6,
    description: '3,000 xPloits',
    currency: 3000,
    tonCurrency: 572,
    image: '',
  },
];

export default function StorePage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [goods] = useState<Good[]>(mockGoods);
  return (
    <div className={styles.store}>
      <div className={styles.subscriptions}>
        <Subscriptions subscriptions={subscriptions} />
      </div>
      <div className={styles.title}>all goods</div>
      <div className={styles.goods}>
        <Goods goods={goods} />
      </div>
    </div>
  );
}
