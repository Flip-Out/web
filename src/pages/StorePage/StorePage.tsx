import { useEffect, useState } from 'react';
import { Good, Subscription } from '../../types';
import styles from './StorePage.module.css';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';
import { Goods } from '../../components/Goods/Goods';
import { AeonModal } from '../../components/AeonModal/AeonModal';
import { useDispatch } from '../../store/dispatch';
import { addNotification } from '../../store/actions';
import {
  loadFromLocalStorage,
  LOCAL_STORAGE,
  removeFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/localStorage';

const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    power: 101,
    crystals: 256,
    cash: 256,
    details: 'Subscribe to the flipout weekly pack',
    additionalInfo: 'Receive daily:',
    currency: 25,
    tonCurrency: 15,
    frequency: 'per day',
  },
];

const mockGoods: Good[] = [
  {
    id: 1,
    description: '10 xPloits',
    currency: 1,
    tonCurrency: 1.9,
    image: '',
  },
  {
    id: 2,
    description: '100 xPloits',
    currency: 3,
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
  const [aeonModal, setAeonModal] = useState({ open: false, url: '' });
  const { dispatch } = useDispatch();

  const handleBuyInit = (url: string) => {
    if (url) {
      saveToLocalStorage(LOCAL_STORAGE.AEON_URL, url);
      setAeonModal({ open: true, url });
      return;
    }
    dispatch(
      addNotification({ type: 'error', message: "Payment wasn't initialized" })
    );
  };

  // const addCloseIframe = () => {
  //   window.closeIframe = () => {
  //     handleCloseAeonModal();
  //     window.closeIframe = null;
  //   };
  // };

  useEffect(() => {
    const url = loadFromLocalStorage<string>(LOCAL_STORAGE.AEON_URL);
    if (url) {
      setAeonModal({ open: true, url });
      // addCloseIframe();
    }
  }, []);

  const handleCloseAeonModal = () => {
    removeFromLocalStorage(LOCAL_STORAGE.AEON_URL);
    setAeonModal({ open: false, url: '' });
  };

  return (
    <div className={styles.store}>
      <div className={styles.subscriptions}>
        <Subscriptions subscriptions={subscriptions} />
      </div>
      <div className={styles.title}>all goods</div>
      <div className={styles.goods}>
        <Goods goods={goods} handleBuyInit={handleBuyInit} />
      </div>
      <AeonModal
        open={aeonModal.open}
        url={aeonModal.url}
        onCLose={handleCloseAeonModal}
      />
    </div>
  );
}
