import {Suspense, lazy} from 'react';
import {Outlet} from 'react-router-dom';
// auth
import {AuthGuard} from './../../auth/guard';
// layouts
import DashboardLayout from './../../layouts/dashboard';
// components
import {LoadingScreen} from './../../components/loading-screen';
import {SelectedWorkspaceProvider} from "../../layouts/dashboard/context/workspace-provider.tsx";
import {SelectedAgentProvider} from "../../layouts/dashboard/context/agent-provider.tsx";
import {SelectedSessionProvider} from "../../layouts/dashboard/context/session-provider.tsx";

// ----------------------------------------------------------------------

const IndexPage = lazy(() => import('./../../pages/dashboard/chat'));

// ----------------------------------------------------------------------

export const dashboardRoutes = [
    {
        path: 'chat',
        element: (
            <AuthGuard>
                <SelectedWorkspaceProvider>
                    <SelectedAgentProvider>
                        <SelectedSessionProvider>
                            <DashboardLayout>
                                <Suspense fallback={<LoadingScreen/>}>
                                    <Outlet/>
                                </Suspense>
                            </DashboardLayout>
                        </SelectedSessionProvider>
                    </SelectedAgentProvider>
                </SelectedWorkspaceProvider>
            </AuthGuard>
        ),
        children: [
            {element: <IndexPage/>, index: true},
        ],
    },
];
