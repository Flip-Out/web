import { TelegramAuthData } from '@telegram-auth/react';
import styles from './User.module.css';
import Power from '../../assets/Power';
import Crystals from '../../assets/Crystals';

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
        <div className={styles.detailsWrapper}>
          <div className={styles.details}>
            <Power />
            <div>654</div>
          </div>
          <div className={styles.details}>
            <Crystals />
            <div>249</div>
          </div>
        </div>
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
