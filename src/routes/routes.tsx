import { Outlet, RouteObject } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import AuthLoader from '../components/Loaders/AuthLoader';
import LandingPage from '../pages/LandingPage/LandingPage';
import StorePage from '../pages/StorePage/StorePage';
import VerifyPurchasePage from '../pages/VerifyPurchasePage/VerifyPurchasePage';
import ForbiddenBrowserPage from '../pages/ForbiddenBrowserPage/ForbiddenBrowserPage';

export const ROOT_ROUTER = 'root';

export enum AppRoutes {
  ROOT = '/',
  STORE = 'store',
  VERIFY_PAYMENT = 'verify_payment',
  FORBIDDEN_BROWSER = 'forbiden_browser',
}

export const routes: RouteObject[] = [
  {
    id: ROOT_ROUTER,
    Component: Outlet,
    children: [
      {
        index: true,
        Component: LandingPage,
      },
      {
        path: AppRoutes.STORE,
        Component: Layout,
        children: [
          {
            index: true,
            loader: AuthLoader,
            Component: StorePage,
          },
        ],
      },
      {
        path: AppRoutes.FORBIDDEN_BROWSER,
        Component: ForbiddenBrowserPage,
      },
      {
        path: AppRoutes.VERIFY_PAYMENT,
        loader: AuthLoader,
        Component: VerifyPurchasePage,
      },
    ],
  },
  {
    path: '*',
  },
];
