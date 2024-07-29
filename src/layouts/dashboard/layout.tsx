// @mui
import Box from '@mui/material/Box';
// hooks
import {useBoolean} from './../../hooks/use-boolean';
//
import Main from './main';
import Header from './header';
import NavVertical from './nav-vertical';
import {
    SelectedWorkspaceContextValue,
    WORKSPACE_STORAGE_KEY
} from "./context/workspace-provider.tsx";
import {useEffect} from "react";
import loadWorkspaces from "../../utils/calls/workspace/load-workspaces.ts";
import {Workspace} from "../../utils/dto/Workspace.ts";
import {localStorageGetItem, localStorageSetItem} from "../../utils/storage-available.ts";
import {useSelectedWorkspaceContext} from "./context/workspace-context.tsx";

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({children}: Props) {
    const value: SelectedWorkspaceContextValue = useSelectedWorkspaceContext();

    useEffect((): void => {
        let loadedWorkspace = localStorageGetItem(WORKSPACE_STORAGE_KEY, '');
        if (loadedWorkspace && loadedWorkspace.length > 0) {
            let workspace = JSON.parse(loadedWorkspace);
            value.setSelectedWorkspace(workspace);
        } else {
            loadWorkspaces().then((result: Array<Workspace>): void => {
                if (result.length > 0) {
                    let workspace = result[0];
                    value.setSelectedWorkspace(workspace);
                    localStorageSetItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
                }
            });
        }
    }, []);

    const nav = useBoolean();

    const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse}/>;

    return (
        <>
            <Header onOpenNav={nav.onTrue}/>

            <Box sx={{
                display: {lg: 'flex'},
                minHeight: {lg: 1},
            }}
            >
                {renderNavVertical}

                <Main sx={{paddingTop: '0', paddingBottom: '0' , marginTop: '90px'}}>{children}</Main>
            </Box>
        </>
    );
}
