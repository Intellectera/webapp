// @mui
import Box from '@mui/material/Box';
// hooks
import {useBoolean} from './../../hooks/use-boolean';
import {useResponsive} from './../../hooks/use-responsive';
// components
import {useSettingsContext} from '../../components/settings';
//
import Main from './main';
import Header from './header';
import NavVertical from './nav-vertical';
import {
    SelectedWorkspaceContext,
    SelectedWorkspaceContextValue,
    WORKSPACE_STORAGE_KEY
} from "./context/workspace-provider.tsx";
import {useContext, useEffect} from "react";
import loadWorkspaces from "../../utils/calls/workspace/load-workspaces.ts";
import {Workspace} from "../../utils/dto/Workspace.ts";
import {localStorageGetItem, localStorageSetItem} from "../../utils/storage-available.ts";

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({children}: Props) {
    const value: SelectedWorkspaceContextValue = useContext(SelectedWorkspaceContext);

    useEffect((): void => {
        let loadedWorkspace = localStorageGetItem(WORKSPACE_STORAGE_KEY, '');
        if (loadedWorkspace && loadedWorkspace.length > 0) {
            loadWorkspaces().then((result: Array<Workspace>): void => {
                if (result.length > 0) {
                    let workspace = result[0];
                    value.setSelectedWorkspace(workspace);
                    localStorageSetItem(WORKSPACE_STORAGE_KEY, JSON.stringify(workspace))
                }
            });
        }
    }, []);

    const settings = useSettingsContext();

    const lgUp = useResponsive('up', 'lg');

    const nav = useBoolean();

    const isHorizontal = settings.themeLayout === 'horizontal';

    const isMini = settings.themeLayout === 'mini';

    const renderNavVertical = <NavVertical openNav={nav.value} onCloseNav={nav.onFalse}/>;

    if (isHorizontal) {
        return (
            <>
                <Header onOpenNav={nav.onTrue}/>

                {renderNavVertical}

                <Main>{children}</Main>
            </>
        );
    }

    if (isMini) {
        return (
            <>
                <Header onOpenNav={nav.onTrue}/>

                <Box
                    sx={{
                        display: {lg: 'flex'},
                        minHeight: {lg: 1},
                    }}
                >
                    {renderNavVertical}

                    <Main>{children}</Main>
                </Box>
            </>
        );
    }

    return (
        <>
            <Header onOpenNav={nav.onTrue}/>

            <Box
                sx={{
                    display: {lg: 'flex'},
                    minHeight: {lg: 1},
                }}
            >
                {renderNavVertical}

                <Main>{children}</Main>
            </Box>
        </>
    );
}
