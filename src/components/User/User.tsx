import { TelegramAuthData } from '@telegram-auth/react';
import { Currency } from '../Currency/Currency';
import styles from './User.module.css';

interface UserProps {
  user: TelegramAuthData;
}

export default function User({ user }: UserProps) {
  const username =
    user.first_name || user.last_name
      ? user.first_name + ' ' + user.last_name
      : 'Unknown';

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
    </div>
  );
}
