import { Suspense, lazy } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// auth
import { AuthGuard } from './../../auth/guard';
// layouts
import DashboardLayout from './../../layouts/dashboard';
// components
import { LoadingScreen } from './../../components/loading-screen';

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('./../../pages/dashboard/one'));
const PageTwo = lazy(() => import('./../../pages/dashboard/two'));

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
    ],
  }
];
