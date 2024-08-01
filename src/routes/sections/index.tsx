import { Navigate, useRoutes } from 'react-router-dom';
// config
import { PATH_AFTER_LOGIN } from './../../config-global';
//
import { mainRoutes } from './main';

import { authRoutes } from './auth';
import { dashboardRoutes } from './dashboard';
import {newAgentRoutes} from "./new-agent.tsx";

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      path: '/',
      element: <Navigate to={PATH_AFTER_LOGIN} replace />,
    },

    // Auth routes
    ...authRoutes,

    // Dashboard routes
    ...dashboardRoutes,

    // Main routes
    ...mainRoutes,

      // New Agent Routes
      ...newAgentRoutes,

    // No match 404
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
