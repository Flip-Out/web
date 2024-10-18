import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { routes } from './routes';
import FallbackLoader from '../components/Loaders/FallbackLoader';

const router = createBrowserRouter(routes);

export default function Router() {
  return (
    <RouterProvider router={router} fallbackElement={<FallbackLoader />} />
  );
}
