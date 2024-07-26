import {Suspense, lazy} from 'react';
import {Outlet, Navigate} from 'react-router-dom';
// auth
import {AuthGuard} from './../../auth/guard';
// layouts
import DashboardLayout from './../../layouts/dashboard';
// components
import {LoadingScreen} from './../../components/loading-screen';
import {SelectedWorkspaceProvider} from "../../layouts/dashboard/context/workspace-provider.tsx";

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('./../../pages/dashboard/one'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
    {
        path: 'dashboard',
        element: (
            <AuthGuard>
                <SelectedWorkspaceProvider>
                    <DashboardLayout>
                        <Suspense fallback={<LoadingScreen/>}>
                            <Outlet/>
                        </Suspense>
                    </DashboardLayout>
                </SelectedWorkspaceProvider>
            </AuthGuard>
        ),
        children: [
            {element: <IndexPage/>, index: true},
        ],
    },
];
