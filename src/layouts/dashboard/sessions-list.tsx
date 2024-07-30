import List from '@mui/material/List';
import {alpha} from "@mui/material/styles";
import {useSelectedAgentContext} from "./context/agent-context.tsx";
import {useEffect, useState} from "react";
import {Session} from "../../utils/dto/Session.ts";
import loadSessions from "../../utils/calls/session/load-sessions.tsx";
import {useSettingsContext} from "../../components/settings";
import {useSelectedSessionContext} from "./context/session-context.tsx";
import {SelectedSessionContextValue} from "./context/session-provider.tsx";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SessionsList() {
    const selectedAgentContextValue = useSelectedAgentContext();
    const selectedSessionContextValue: SelectedSessionContextValue = useSelectedSessionContext();
    const [sessions, setSessions] = useState<Session[]>([]);
    const settings = useSettingsContext();

    useEffect(() => {
        let selectedAgent = selectedAgentContextValue.selectedAgent;
        if (selectedAgent){
            loadSessions(selectedAgent.id!).then((result: Array<Session>) => {
                setSessions(result)
                if (result.length > 0){
                    selectedSessionContextValue.setSelectedSession(result[0])
                }
            })
        }
    }, [selectedAgentContextValue.selectedAgent])

    const handleSessionSelect = (session: Session): void => {
        selectedSessionContextValue.setSelectedSession(session);
    }

    let hoverBGClass = settings.themeMode === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700';
    let BGClass = settings.themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700';

    return (
            <List className={'overflow-y-scroll'} sx={{ width: '100%', maxWidth: 360, bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1) }}>
                {sessions.map((session: Session) => (
                    <div key={session.id} className={classNames(' w-100 p-2 m-1 hover:rounded-lg group flex justify-between',
                        hoverBGClass,
                        selectedSessionContextValue.selectedSession?.id === session.id ? (BGClass + ' rounded-lg') : '' )}>
                        <p onClick={() => handleSessionSelect(session)} className={'text-sm font-light cursor-pointer flex-1'}>
                            {session.name}
                        </p>

                        <div className={'invisible group-hover:visible cursor-pointer'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                        </div>

                    </div>
                ))}
            </List>
    );
}
