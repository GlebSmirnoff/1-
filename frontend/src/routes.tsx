import { RouteObject } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import InfoPage from '@/blocks/main/InfoPage';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/info/:slug',
    element: <InfoPage />,
  },
];

export default routes;
