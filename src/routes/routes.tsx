import { RouteObject } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AuthLoader from '../components/Loaders/AuthLoader';
import LoginLoader from '../components/Loaders/LoginLoader';
import LandingPage from '../pages/LandingPage/LandingPage';
import LoginPage from '../pages/LoginPage/LoginPage';
import StorePage from '../pages/StorePage/StorePage';

export const ROOT_ROUTER = 'root';

export enum AppRoutes {
  ROOT = '/',
  STORE = 'store',
}

export const routes: RouteObject[] = [
  {
    id: ROOT_ROUTER,
    path: AppRoutes.ROOT,
    loader() {
      return {};
    },
    Component: Layout,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: AppRoutes.STORE,
        loader: AuthLoader,
        Component: StorePage,
      },
    ],
  },
  {
    path: '*',
  },
];
