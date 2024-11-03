import { Slide } from '@mui/material';
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

export default function StorePage() {
  const [subscriptions] = useState<Subscription[]>(mockSubscriptions);
  const [goods, setGoods] = useState<Good[]>([]);
  const [aeonModal, setAeonModal] = useState({
    open: false,
    url: '',
    title: '',
  });
  const { dispatch } = useDispatch();
  const { loadUserBalance, loadStoreGoods } = useStoreApi();

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

  const loadBalance = async () => {
    await loadUserBalance()
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

  const addCloseIframe = () => {
    window.closeIframe = () => {
      handleCloseAeonModal();
      window.closeIframe = () => {};
      loadBalance();
    };
  };

  useEffect(() => {
    const url = loadFromLocalStorage<string>(LOCAL_STORAGE.AEON_URL);
    const title = loadFromLocalStorage<string>(LOCAL_STORAGE.AEON_TITLE);
    if (url && title) {
      setAeonModal({ open: true, url, title });
      addCloseIframe();
    }
    loadStoreGoods()
      .then((data) => {
        setGoods(data.data);
      })
      .catch((e) => {
        dispatch(
          addNotification({
            message: e?.message || 'Failed to load user goods',
            type: 'error',
          })
        );
      });
  }, []);

  const handleCloseAeonModal = () => {
    loadBalance();
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
      <Slide direction="right" in={goods.length > 0} mountOnEnter unmountOnExit>
        <div className={styles.goods}>
          <Goods goods={goods} handleBuyInit={handleBuyInit} />
        </div>
      </Slide>
      <AeonModal
        open={aeonModal.open}
        url={aeonModal.url}
        title={aeonModal.title}
        onCLose={handleCloseAeonModal}
      />
    </div>
  );
}
