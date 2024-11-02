import { TelegramAuthData } from '@telegram-auth/react';
import { Currency } from '../Currency/Currency';
import styles from './User.module.css';
import Logout from '../../assets/Logout';
import {
  LOCAL_STORAGE,
  removeFromLocalStorage,
} from '../../utils/localStorage';
import { useEffect, useMemo } from 'react';
import { useStoreApi } from '../../hooks/useStoreApi';
import { useDispatch } from '../../store/dispatch';
import { addNotification, updateBalances } from '../../store/actions';
import { useAppStateSelectors } from '../../store/selectors';

interface UserProps {
  user: TelegramAuthData;
}

export default function User({ user }: UserProps) {
  const { loadUserBalance } = useStoreApi();
  const { dispatch } = useDispatch();
  const { balances } = useAppStateSelectors();

  const username =
    user.first_name || user.last_name
      ? user.first_name || '' + ' ' + user.last_name || ''
      : 'Unknown';

  const onLogOutClick = () => {
    removeFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
    location.reload();
  };

  const xploits = useMemo(
    () => balances.find((it) => it.currencyName === 'xploit')?.balance || 0,
    [balances]
  );
  const chips = useMemo(
    () => balances.find((it) => it.currencyName === 'chip')?.balance || 0,
    [balances]
  );

  useEffect(() => {
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
  }, []);

  return (
    <div className={styles.userWrapper}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{username}</div>
        <Currency
          power={xploits}
          crystals={chips}
          className={styles.currency}
        />
      </div>
      <img
        src={user.photo_url || 'empty_user.jpg'}
        alt="user"
        width={42}
        height={42}
        className={styles.userIcon}
      />
      <div onClick={onLogOutClick}>
        <Logout className={styles.logout} />
      </div>
    </div>
  );
}
