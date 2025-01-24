import { lazy } from 'react';

// layouts
import AuthClassicLayout from './../../layouts/auth/classic';

// ----------------------------------------------------------------------

// JWT
const JwtLoginPage = lazy(() => import('./../../pages/auth/jwt/login'));
const JwtRegisterPage = lazy(() => import('./../../pages/auth/jwt/register'));
const ForgetPassword = lazy(() => import('../../pages/auth/jwt/forget-password'));
const RecoverPassword = lazy(() => import('../../pages/auth/jwt/recover-password'));
const WorkspaceInvitation = lazy(() => import('../../pages/auth/workspace-invitation'));

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
      path: 'recover-password/:token',
      element: (
        <AuthClassicLayout>
          <RecoverPassword />
        </AuthClassicLayout>
      ),
    },
    {
      path: 'workspace-invitation/:token',
      element: (
        <AuthClassicLayout>
          <WorkspaceInvitation />
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
