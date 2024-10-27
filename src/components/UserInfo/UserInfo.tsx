import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { useLayoutEffect, useState } from 'react';
import {
  loadFromLocalStorage,
  LOCAL_STORAGE,
  saveToLocalStorage,
} from '../../utils/localStorage';
import User from '../User/User';

export default function UserInfo() {
  const [user, setUser] = useState<TelegramAuthData>();

  useLayoutEffect(() => {
    const userData = loadFromLocalStorage<string>(
      LOCAL_STORAGE.TELEGRAM_AUTH_DATA
    );

    if (userData) {
      setUser(JSON.parse(userData) as TelegramAuthData);
    }
  }, []);

  const handleAuthCallback = (data: TelegramAuthData) => {
    console.log(data);
    saveToLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA, JSON.stringify(data));
    setUser(data);
  };
  return (
    <>
      {user ? (
        <User user={user} />
      ) : (
        <LoginButton
          onAuthCallback={handleAuthCallback}
          botUsername={import.meta.env.VITE_BOT_USERNAME}
          buttonSize="medium"
          cornerRadius={5}
          showAvatar={false}
          lang="en"
        />
      )}
    </>
  );
}
