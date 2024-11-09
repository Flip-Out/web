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

export default function StorePage() {
  const [goods, setGoods] = useState<Good[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [activeSubscriptions, setActiveSubscriptions] = useState<number[]>([]);
  const [aeonModal, setAeonModal] = useState({
    open: false,
    url: '',
    title: '',
  });
  const { dispatch } = useDispatch();
  const { loadUserBalance, loadStoreGoods, loadStoreSubscrptions } =
    useStoreApi();

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

    loadStoreSubscrptions()
      .then((data) => {
        setSubscriptions(data.data.subscriptions);
        setActiveSubscriptions(data.data.activeSubscriptions);
      })
      .catch((e) => {
        dispatch(
          addNotification({
            message: e?.message || 'Failed to load user subscriptions',
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
        <Subscriptions
          subscriptions={subscriptions}
          activeSubscriptions={activeSubscriptions}
          handleBuyInit={handleBuyInit}
        />
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
