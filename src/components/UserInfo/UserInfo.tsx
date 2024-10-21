import { LoginButton, TelegramAuthData } from '@telegram-auth/react';
import { useLayoutEffect, useState } from 'react';
import {
  loadFromLocalStorage,
  LOCAL_STORAGE,
  saveToLocalStorage,
} from '../../utils/localStorage';
import { clearIframeCookie } from '../../utils/cookie';
import User from './User';

const TELEGRAM_IFRAME_ID =
  'telegram-login-' + import.meta.env.VITE_BOT_USERNAME;

export default function UserInfo() {
  const [user, setUser] = useState<TelegramAuthData>();

  useLayoutEffect(() => {
    const userData = loadFromLocalStorage<TelegramAuthData>(
      LOCAL_STORAGE.TELEGRAM_AUTH_DATA
    );

    if (userData) {
      setUser(userData);
    } else {
      clearIframeCookie(TELEGRAM_IFRAME_ID);
    }
  }, []);

  const handleAuthCallback = (data: TelegramAuthData) => {
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
          lang="en"
        />
      )}
    </>
  );
}
