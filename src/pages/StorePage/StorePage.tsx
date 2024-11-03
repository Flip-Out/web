import { useEffect, useState } from 'react';
import { AeonModal } from '../../components/AeonModal/AeonModal';
import { Goods } from '../../components/Goods/Goods';
import { Subscriptions } from '../../components/Subscriptions/Subscriptions';
import { useStoreApi } from '../../hooks/useStoreApi';
import { addNotification, updateBalances } from '../../store/actions';
import { useDispatch } from '../../store/dispatch';
import { Good, Subscription } from '../../types';
import {
  loadFromLocalStorage,
  LOCAL_STORAGE,
  removeFromLocalStorage,
  saveToLocalStorage,
} from '../../utils/localStorage';
import styles from './StorePage.module.css';

const mockSubscriptions: Subscription[] = [
  {
    id: 1,
    power: 200,
    crystals: 50,
    cash: 2,
    details: 'Subscribe to the flipout weekly pack',
    additionalInfo: 'Receive daily',
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
    image: '10.png',
  },
  {
    id: 2,
    description: '100 xPloits',
    currency: 3,
    tonCurrency: 19,
    image: '100.png',
    discount: '20% off',
  },
  {
    id: 3,
    description: '500 xPloits',
    currency: 500,
    tonCurrency: 95,
    image: '500.png',
    discount: '30% off',
  },
  {
    id: 4,
    description: '1,000 xPloits',
    currency: 1000,
    tonCurrency: 190,
    image: '1000.png',
    discount: '40% off',
  },
  {
    id: 5,
    description: '2,000 xPloits',
    currency: 2000,
    tonCurrency: 381,
    image: '2000.png',
    discount: '50% off',
  },
  {
    id: 6,
    description: '3,000 xPloits',
    currency: 3000,
    tonCurrency: 572,
    image: '3000.png',
    discount: '60% off',
  },
];

export default function StorePage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [goods] = useState<Good[]>(mockGoods);
  const [aeonModal, setAeonModal] = useState({
    open: false,
    url: '',
    title: '',
  });
  const { dispatch } = useDispatch();
  const { loadUserBalance } = useStoreApi();

  const handleBuyInit = (url: string, title: string) => {
    if (url) {
      saveToLocalStorage(LOCAL_STORAGE.AEON_URL, url);
      saveToLocalStorage(LOCAL_STORAGE.AEON_TITLE, title);
      setAeonModal({ open: true, url, title });
      addCloseIframe();
      return;
    }
    dispatch(
      addNotification({ type: 'error', message: "Payment wasn't initialized" })
    );
  };

  const addCloseIframe = () => {
    window.closeIframe = () => {
      handleCloseAeonModal();
      window.closeIframe = () => {};
      loadUserBalance()
        .then((data) => {
          dispatch(updateBalances(data.data));
        })
        .catch((e) => {
          dispatch(
            addNotification({
              message: e?.message || 'Failed to load user balance',
              type: 'error',
            })
          );
        });
    };
  };

  useEffect(() => {
    const url = loadFromLocalStorage<string>(LOCAL_STORAGE.AEON_URL);
    const title = loadFromLocalStorage<string>(LOCAL_STORAGE.AEON_TITLE);
    if (url && title) {
      setAeonModal({ open: true, url, title });
      addCloseIframe();
    }
  }, []);

  const handleCloseAeonModal = () => {
    removeFromLocalStorage(LOCAL_STORAGE.AEON_URL);
    removeFromLocalStorage(LOCAL_STORAGE.AEON_TITLE);
    setAeonModal({ open: false, url: '', title: '' });
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
        title={aeonModal.title}
        onCLose={handleCloseAeonModal}
      />
    </div>
  );
}
