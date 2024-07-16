import { Suspense, lazy } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { AuthGuard } from './../../auth/guard';
// layouts
import DashboardLayout from './../../layouts/dashboard';
// components
import { LoadingScreen } from './../../components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('./../../pages/dashboard/one'));
const PageTwo = lazy(() => import('./../../pages/dashboard/two'));
const PageThree = lazy(() => import('./../../pages/dashboard/three'));
const PageFour = lazy(() => import('./../../pages/dashboard/four'));
const PageFive = lazy(() => import('./../../pages/dashboard/five'));
const PageSix = lazy(() => import('./../../pages/dashboard/six'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
  {
    path: 'dashboard',
    element: (
      <AuthGuard>
        <DashboardLayout>
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      </AuthGuard>
    ),
    children: [
      { element: <IndexPage />, index: true },
      { path: 'two', element: <PageTwo /> },
      { path: 'three', element: <PageThree /> },
      {
        path: 'group',
        children: [
          { element: <PageFour />, index: true },
          { path: 'five', element: <PageFive /> },
          { path: 'six', element: <PageSix /> },
        ],
      },
    ],
  },
];
