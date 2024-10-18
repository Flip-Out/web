import { redirect } from 'react-router-dom';
import { AppRoutes } from '../../routes/routes';

export default function LoginLoader() {
  const isLoggedIn = false;

  if (isLoggedIn) {
    return redirect(AppRoutes.ROOT + AppRoutes.STORE);
  }

  return <>Loading....</>;
}
