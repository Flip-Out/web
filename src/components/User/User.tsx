import { TelegramAuthData } from '@telegram-auth/react';
import { Currency } from '../Currency/Currency';
import styles from './User.module.css';
import Logout from '../../assets/Logout';
import {
  LOCAL_STORAGE,
  removeFromLocalStorage,
} from '../../utils/localStorage';

interface UserProps {
  user: TelegramAuthData;
}

export default function User({ user }: UserProps) {
  const username =
    user.first_name || user.last_name
      ? user.first_name || '' + ' ' + user.last_name || ''
      : 'Unknown';

  const onLogOutClick = () => {
    removeFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
    location.reload();
  };

  return (
    <div className={styles.userWrapper}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{username}</div>
        <Currency power={100} crystals={100} className={styles.currency} />
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
