import { lazy } from 'react';
import { Outlet } from 'react-router-dom';
// auth
import { GuestGuard } from './../../auth/guard';
// layouts
import AuthClassicLayout from './../../layouts/auth/classic';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('./../../pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('./../../pages/auth/jwt/register'));

// ----------------------------------------------------------------------

const authJwt = {
  path: 'jwt',
  element: (
    <GuestGuard>
      <Outlet />
    </GuestGuard>
  ),
  children: [
    {
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout title="Manage the job more effectively with Minimal">
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    },
  ],
};

export const authRoutes = [
  {
    path: 'auth',
    children: [authJwt],
  },
];
