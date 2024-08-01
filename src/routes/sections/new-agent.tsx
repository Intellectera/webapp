import {AuthGuard} from "../../auth/guard";
import {Outlet} from 'react-router-dom';
import {lazy} from "react";


const IndexPage = lazy(() => import('./../../pages/new-agent/panel.tsx'));


export const newAgentRoutes = [
    {
        path: 'new-agent',
        element: (
            <AuthGuard>
                <Outlet/>
            </AuthGuard>
        ),
        children: [
            {element: <IndexPage/>, index: true},
        ],
    },
];
