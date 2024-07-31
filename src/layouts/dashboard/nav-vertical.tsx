import {useEffect, useState} from 'react';
// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
// hooks
import {useResponsive} from './../../hooks/use-responsive';
// components
import Scrollbar from './../../components/scrollbar';
import {usePathname} from '../../routes/hook';
//
import {NAV} from './../config-layout';
import SessionsList from "./sessions-list.tsx";
import {useSettingsContext} from "../../components/settings";
import {useTranslation} from "react-i18next";
import {FormControl, Select} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import {Agent} from "../../utils/dto/Agent.ts";
import {localStorageSetItem} from "../../utils/storage-available.ts";
import {AGENT_STORAGE_KEY} from "./context/agent-provider.tsx";
import {useSelectedAgentContext} from "./context/agent-context.tsx";
import loadAgents from "../../utils/calls/agent/load-agents.ts";
import {useSelectedWorkspaceContext} from "./context/workspace-context.tsx";

// ----------------------------------------------------------------------

type Props = {
    openNav: boolean;
    onCloseNav: VoidFunction;
};

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}
export default function NavVertical({openNav, onCloseNav}: Props) {
    const settings = useSettingsContext();
    const {t } = useTranslation();
    const pathname = usePathname();
    const lgUp = useResponsive('up', 'lg');
    const selectedAgentContextValue = useSelectedAgentContext();
    const selectedWorkspace = useSelectedWorkspaceContext();

    const [agents, setAgents] = useState<Array<Agent>>([]);

    useEffect(() => {
        if (selectedWorkspace.selectedWorkspace){
            loadAgents(selectedWorkspace.selectedWorkspace.id!).then((result) => {
                setAgents(result);
            })
        }
    }, [selectedWorkspace.selectedWorkspace])


    const handleSelectAgent = (id: string) => {
        let value = agents.find((agent) => agent.id === id)!;
        selectedAgentContextValue.setSelectedAgent(value);
        localStorageSetItem(AGENT_STORAGE_KEY, JSON.stringify(value))
    }

    useEffect(() => {
        if (openNav) {
            onCloseNav();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const renderContent = (
        <Scrollbar
            sx={{
                height: 1,
                '& .simplebar-content': {
                    height: 1,
                    display: 'flex',
                    flexDirection: 'column',
                },
            }}
        >
            <div className={classNames("p-1 mx-2 flex-1 flex items-start flex-col justify-center")}>
                <FormControl className={'w-[100%]'} size="medium">
                    {agents.length > 0 && (
                        <Select defaultValue="" value={selectedAgentContextValue.selectedAgent?.id ?? ''} onChange={(value) => {handleSelectAgent(value.target.value as string)}}>
                            {agents.map(agent => (
                                <MenuItem key={agent.id} value={agent.id}>{agent.name}</MenuItem>
                            ))}
                        </Select>
                    )}
                </FormControl>
            </div>

            <div className="mx-3 my-4">
                <button
                    className={classNames('flex w-full gap-x-4 rounded-lg border border-slate-300 p-2 text-sm font-medium transition-colors duration-200 hover:bg-slate-200 focus:outline-none', settings.themeMode === 'dark' ? 'border-slate-700 text-slate-200 hover:bg-slate-800' : '')}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        strokeWidth="2"
                        stroke="currentColor"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                        <path d="M12 5l0 14"></path>
                        <path d="M5 12l14 0"></path>
                    </svg>
                    {t('labels.new_chat')}
                </button>
            </div>

            <SessionsList/>


        </Scrollbar>
    );

    return (
        <Box
            component="nav"
            sx={{
                flexShrink: {lg: 0},
                width: {lg: NAV.W_VERTICAL},
            }}
        >

            {lgUp ? (
                <Stack
                    sx={{
                        height: 1,
                        position: 'fixed',
                        width: NAV.W_VERTICAL,
                        borderRight: (theme) => `dashed 1px ${theme.palette.divider}`,
                    }}
                >
                    {renderContent}
                </Stack>
            ) : (
                <Drawer
                    open={openNav}
                    onClose={onCloseNav}
                    PaperProps={{
                        sx: {
                            width: NAV.W_VERTICAL,
                        },
                    }}
                >
                    {renderContent}
                </Drawer>
            )}
        </Box>
    );
}
