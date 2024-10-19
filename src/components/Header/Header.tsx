import { LoginButton, TelegramAuthData } from '@telegram-auth/react';

export default function Header() {
  const handleAuthCallback = (data: TelegramAuthData) => {
    console.log(data);
  };

  return (
    <div className="App">
      <LoginButton
        onAuthCallback={handleAuthCallback}
        botUsername={import.meta.env.VITE_BOT_USERNAME}
        // authCallbackUrl="/store"
        buttonSize="medium"
        cornerRadius={5}
        showAvatar
        lang="en"
      />
    </div>
  );
}
