import { lazy } from 'react';

// layouts
import AuthClassicLayout from './../../layouts/auth/classic';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('./../../pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('./../../pages/auth/jwt/register'));
const ForgetPassword = lazy(() => import('../../pages/auth/jwt/forget-password'));

// ----------------------------------------------------------------------

export const authRoutes = [
  {
    path: 'auth',
    children: [{
      path: 'login',
      element: (
        <AuthClassicLayout>
          <JwtLoginPage />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'forget-password',
      element: (
        <AuthClassicLayout>
          <ForgetPassword />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'register',
      element: (
        <AuthClassicLayout>
          <JwtRegisterPage />
        </AuthClassicLayout>
      ),
    }],
  },
];
