import { TelegramAuthData } from '@telegram-auth/react';
import styles from './User.module.css';

interface UserProps {
  user: TelegramAuthData;
}

export default function User({ user }: UserProps) {
  return (
    <div className={styles.userWrapper}>
      <div></div>
      <img
        src={user.photo_url || 'empty_user.jpg'}
        alt="user"
        width={30}
        height={30}
        className={styles.userIcon}
      />
    </div>
  );
}
