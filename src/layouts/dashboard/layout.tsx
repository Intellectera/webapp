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
} from "./context/workspace-provider.tsx";
import {useEffect} from "react";
import {localStorageSetItem} from "../../utils/storage-available.ts";
import {useSelectedWorkspaceContext} from "./context/workspace-context.tsx";
import loadAgents from "../../utils/calls/agent/load-agents.ts";
import {Agent} from "../../utils/dto/Agent.ts";
import {useSelectedAgentContext} from "./context/agent-context.tsx";
import {AGENT_STORAGE_KEY, SelectedAgentContextValue} from "./context/agent-provider.tsx";

// ----------------------------------------------------------------------

type Props = {
    children: React.ReactNode;
};

export default function DashboardLayout({children}: Props) {
    const selectedWorkspaceContextValue: SelectedWorkspaceContextValue = useSelectedWorkspaceContext();
    const selectedAgentContextValue: SelectedAgentContextValue = useSelectedAgentContext();


    useEffect(() => {
        if (selectedWorkspaceContextValue && selectedWorkspaceContextValue.selectedWorkspace){
            loadAgents(selectedWorkspaceContextValue.selectedWorkspace.id!).then((result: Array<Agent>) => {
                if (result.length > 0){
                    let agent = result[0];
                    selectedAgentContextValue.setSelectedAgent(agent);
                    localStorageSetItem(AGENT_STORAGE_KEY, JSON.stringify(agent));
                }
            })
        }
    }, [selectedWorkspaceContextValue.selectedWorkspace])


    const nav = useBoolean(true);

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
