import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// layouts
import CompactLayout from './../../layouts/compact';

// ----------------------------------------------------------------------

const Page404 = lazy(() => import('./../../pages/404'));

// ----------------------------------------------------------------------

export const mainRoutes = [
  {
    element: (
      <CompactLayout>
        <Outlet />
      </CompactLayout>
    ),
    children: [{ path: '404', element: <Page404 /> }],
  },
];
