import {useTranslation} from "react-i18next";
import {useSelectedWorkspaceContext} from "../../../layouts/dashboard/context/workspace-context.tsx";
import TableContainer from "@mui/material/TableContainer";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Button from "@mui/material/Button";
import * as React from "react";
import {Agent} from "../../../utils/dto/Agent.ts";
import {useEffect, useState} from "react";
import loadAgents from "../../../utils/calls/agent/load-agents.ts";
import EditAgentView from "./edit-agent.tsx";
import Typography from "@mui/material/Typography";
import {useSettingsContext} from "../../../components/settings";
import DeleteAgentView from "./delete-agent.tsx";
import {getLogoByDatasourceType} from "../new-agent/new-agent-select-datasource.tsx";
import {useSelectedAgentContext} from "../../../layouts/dashboard/context/agent-context.tsx";
import {localStorageRemoveItem} from "../../../utils/storage-available.ts";
import {AGENT_STORAGE_KEY} from "../../../layouts/dashboard/context/agent-provider.tsx";

const tableSortDefault = {
    name: {
        esc: true
    },
}

type TableSortValues = {
    name: {
        esc: boolean
    },
}

export default function AgentListView() {
    const {t} = useTranslation();
    const workspaceContext = useSelectedWorkspaceContext();
    const settings = useSettingsContext();
    const agentContext = useSelectedAgentContext();
    const [tableSortValues, setTableSortValues] = useState<TableSortValues>(tableSortDefault);
    const [agents, setAgents] = React.useState<Array<Agent>>([]);
    const [selectedAgent, setSelectedAgent] = React.useState<Agent | undefined>();
    const [showEdit, setShowEdit] = React.useState<boolean>(false);
    const [deletedAgent, setDeletedAgent] = useState<Agent | undefined>(undefined);

    useEffect((): void => {
        loadAgents(workspaceContext.selectedWorkspace!.id!).then((result: Array<Agent>) => {
            setAgents(result);
        });
    }, []);

    useEffect((): void => {
        if (selectedAgent && showEdit){
            setAgents(prevState => {
                const index: number = prevState.findIndex(agent => agent.id === selectedAgent.id)!;
                prevState[index] = selectedAgent;
                return prevState;
            });
        }
    }, [selectedAgent]);

    useEffect(() => {
        if (deletedAgent){
            setAgents(prevState => {
                prevState = prevState.filter(agent => agent.id !== deletedAgent.id);
                return prevState;
            });
            if (agentContext.selectedAgent && agentContext.selectedAgent.id === deletedAgent.id){
                localStorageRemoveItem(AGENT_STORAGE_KEY);
                agentContext.setSelectedAgent(undefined);
            }
            workspaceContext.setSelectedWorkspace(prevState => {return {...prevState!}});
        }
    }, [deletedAgent])


    const handleSort = () => {
        const esc = tableSortValues.name.esc;
        setTableSortValues(prevState => {return {...prevState, name: {esc: !esc}}})
        setAgents(prevState => prevState.sort((a, b) => {
            return esc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }));
    }

    const handleEditClick = (index: number) => {
        setSelectedAgent(agents[index]);
        setShowEdit(true);
    }

    return (
        <>
            <div className={'w-full h-full flex flex-col'}>
                {!showEdit && (
                    <div className={'w-full flex flex-col items-center justify-center my-6'}>
                        <Typography className={'text-center mb-3'} variant={'h5'}>
                            {t('titles.manage_agents')}
                        </Typography>
                    </div>
                )}

                <div
                    className={'h-[70vh] sm:mb-5 px-10 overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-track-transparent'}>

                    {!showEdit && (
                        <TableContainer className={'w-full'} component={Paper}>
                            <Table stickyHeader={true} aria-label="simple table">
                                <colgroup>
                                    <col className={'w-[80%]'}/>
                                    <col className={'w-[20%]'}/>
                                </colgroup>

                                <TableHead>
                                    <TableRow>
                                        <TableCell onClick={handleSort}
                                            className={'cursor-pointer'}>{(
                                            <div className={'inline-flex gap-1'}>
                                                <span>{t('name')}</span>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                     strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round"
                                                          d="M3.75 6.75h16.5M3.75 12h16.5M12 17.25h8.25"/>
                                                </svg>
                                            </div>)}</TableCell>
                                        <TableCell align="center">{t('labels.actions')}</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {agents.map((agent, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{'&:last-child td, &:last-child th': {border: 0}}}
                                        >
                                            <TableCell>
                                                <div className={'flex justify-start items-center gap-1'}>
                                                    <img className={''} width={30} height={30}
                                                         src={getLogoByDatasourceType(agent.configuration.databaseConfig?.database ?? -1, settings.themeMode)}
                                                         alt={'Mysql icon'}/>
                                                    <span className={'mx-2'}>{agent.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell align="center">
                                                <div
                                                    className={'flex flex-col sm:flex-row justify-center items-center gap-3'}>
                                                    <Button onClick={() => handleEditClick(index)} variant={'outlined'}
                                                            color={'primary'}
                                                            size={'small'}>{t('buttons.edit')}</Button>
                                                    <DeleteAgentView selectedAgent={agent} setDeletedAgent={setDeletedAgent}></DeleteAgentView>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}

                    {(selectedAgent !== undefined && showEdit) && (
                        <EditAgentView setShowEdit={setShowEdit} selectedAgent={selectedAgent!} setSelectedAgent={setSelectedAgent}></EditAgentView>
                    )}
                </div>
            </div>
        </>
    );
}
