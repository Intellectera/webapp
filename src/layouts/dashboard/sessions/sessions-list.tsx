import List from '@mui/material/List';
import {useSelectedAgentContext} from "../context/agent-context.tsx";
import {useEffect, useState} from "react";
import {Session} from "../../../utils/dto/Session.ts";
import loadSessions from "../../../utils/calls/session/load-sessions.tsx";
import {useSettingsContext} from "../../../components/settings";
import {useSelectedSessionContext} from "../context/session-context.tsx";
import {SelectedSessionContextValue} from "../context/session-provider.tsx";
import CustomPopover, {usePopover} from "../../../components/custom-popover";
import MenuItem from "@mui/material/MenuItem";
import {useTranslation} from "react-i18next";
import updateSession from "../../../utils/calls/session/update-session.ts";
import SessionDeleteDialog from "./session-delete-dialog.tsx";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function SessionsList() {
    const selectedAgentContextValue = useSelectedAgentContext();
    const selectedSessionContextValue: SelectedSessionContextValue = useSelectedSessionContext();
    const {t } = useTranslation();
    const [sessions, setSessions] = useState<Session[]>([]);
    const [editSessionIndex , setEditSessionIndex] = useState<number>(0);
    const settings = useSettingsContext();
    const popover = usePopover();

    useEffect(() => {
        let selectedAgent = selectedAgentContextValue.selectedAgent;
        if (selectedAgent){
            loadSessions(selectedAgent.id!).then((result: Array<Session>) => {
                setSessions(result);
                if (result.length > 0){
                    selectedSessionContextValue.setSelectedSession(result[0])
                } else {
                    selectedSessionContextValue.setSelectedSession(undefined);
                }
            })
        } else {
            setSessions([]);
            selectedSessionContextValue.setSelectedSession(undefined);
        }
    }, [selectedAgentContextValue.selectedAgent])

    useEffect((): void => {
        if (sessions.length > 0){
            selectedSessionContextValue.setSelectedSession(sessions[0])
        } else {
            selectedSessionContextValue.setSelectedSession(undefined);
        }
    }, [sessions])

    useEffect(() => {
        if (selectedSessionContextValue.selectedSession && selectedSessionContextValue.selectedSession.isNewSessionTriggered){
            let sessionsClone = [...sessions];
            sessionsClone.unshift(selectedSessionContextValue.selectedSession);
            setSessions(sessionsClone);
        }
    }, [selectedSessionContextValue.selectedSession])

    const handleEditButtonClick = (event: any, index: number) => {
        popover.onOpen(event);
        setEditSessionIndex(index);
    }

    const handleSessionSelect = (session: Session): void => {
        selectedSessionContextValue.setSelectedSession(session);
    }

    const handleEdit = () => {
        popover.onClose();
        const span = document.getElementById(`session-name-${editSessionIndex}`)!;
        span.contentEditable = 'true';
        setTimeout(function() {
            span.focus();
        }, 0);
        span.addEventListener('focusout', () => {
            span.contentEditable = 'false';
        });
        span.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
            }
        });
        span.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                const session = sessions[editSessionIndex];
                session.name = span.textContent ?? '';
                const focusout = new Event('focusout');
                span.dispatchEvent(focusout);
                updateSession(session).then();
            }
        });
    }

    let hoverBGClass = settings.themeMode === 'light' ? 'hover:bg-gray-200' : 'hover:bg-gray-700';
    let BGClass = settings.themeMode === 'light' ? 'bg-gray-200' : 'bg-gray-700';

    return (
            <List className={'overflow-y-scroll scrollbar scrollbar-track-transparent scrollbar-thumb-gray-500 h-[77vh] border-b-[1px] border-dashed'} sx={{ width: '100%', maxWidth: 360 , borderColor: (theme) => theme.palette.divider}}>
                {sessions.map((session: Session, index: number) => (
                    <div key={session.id} className={classNames(' w-100 py-2 px-3 my-1 mx-2 hover:rounded-lg group flex justify-between',
                        hoverBGClass,
                        selectedSessionContextValue.selectedSession?.id === session.id ? (BGClass + ' rounded-lg') : '' )}>
                        <p onClick={() => handleSessionSelect(session)} className={'cursor-pointer flex-1 flex flex-col'}>
                            <span id={`session-name-${index}`} className={'font-bold text-sm truncate'}>
                                {session.name}
                            </span>
                            <span className={'mt-2 text-gray-500 text-sm'}>{session.createdDate}</span>
                        </p>

                        <div onClick={(event) => handleEditButtonClick(event, index)} className={'invisible group-hover:visible cursor-pointer mt-3'}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                 stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                            </svg>
                        </div>
                    </div>
                ))}


                <CustomPopover open={popover.open} onClose={popover.onClose} sx={{width: 160}}>
                    <MenuItem
                        selected={true}
                        onClick={handleEdit}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                             stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                        </svg>

                        {t('buttons.edit')}
                    </MenuItem>
                    <SessionDeleteDialog popover={popover} sessions={sessions} setSessions={setSessions} editSessionIndex={editSessionIndex}></SessionDeleteDialog>
                </CustomPopover>
            </List>
    );
}
