// import { useEffect } from 'react';
import { redirect } from 'react-router-dom';
import { AppRoutes } from '../../routes/routes';

export default function AuthLoader() {
  const isLoggedIn = true;

  if (!isLoggedIn) {
    return redirect(AppRoutes.LOGIN);
  }

  return null;
}
