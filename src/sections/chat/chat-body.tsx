import Box from "@mui/material/Box";
import {alpha} from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import ChatTable from "./table.tsx";
import * as React from "react";
import {useSettingsContext} from "../../components/settings";
import {Conversation} from "../../utils/dto/Conversation.ts";
import {SetStateAction, useState} from "react";
import {Grow} from "@mui/material";
import Button from "@mui/material/Button";
import {useTranslation} from "react-i18next";
import {useSelectedAgentContext} from "../../layouts/dashboard/context/agent-context.tsx";


type Props = {
    showTable: boolean,
    setShowTable: React.Dispatch<SetStateAction<boolean>>,
    messagesEndRef: React.RefObject<HTMLDivElement>,
    chat: Conversation[],
    tableHeaders: string[],
    tableRows: any[],
    handleSendMessage: any;
}


function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function ChatBody({showTable, setShowTable, chat, tableHeaders, tableRows, messagesEndRef, handleSendMessage}: Props) {
    const settings = useSettingsContext();
    const {t} = useTranslation();
    const agent = useSelectedAgentContext();

    const [showCopied, setShowCopied] = useState<boolean>(false);
    const [showSQL, setShowSQL] = useState<boolean>(false);
    const [copiedIndex, setCopiedIndex] = useState<number>(0);

    const handleCopy = async (conversation: Conversation, index: number) => {
        let text = (conversation.agentResponseParam && showSQL) ? conversation.agentResponseParam.sql : conversation.response;
        await navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setShowCopied(true)
        setTimeout(() => {
            setShowCopied(false);
        }, 1000)
    }

    return (
        <div
            className={'relative w-[90%] md:w-[80%] lg:w-[70%] h-[75vh] overflow-y-scroll rounded-lg scrollbar scrollbar-track-transparent'}>
            {chat.map((conversation, index: number) => (
                <div key={conversation.id} className={'transition-all ease-in'}>
                    <Grow style={{transformOrigin: '0 0 0'}} {...({timeout: 500})} in={conversation.message !== undefined}>
                        <Box id={'request-message'}
                             className={classNames('w-[100%] flex mt-5', settings.themeDirection === 'rtl' ? 'flex-row' : 'flex-row-reverse')}>
                            <Box sx={{bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1)}}
                                 className={'m-2 w-[70%] md:w-[60%] lg:w-[50%] text-start pt-3 pb-3 pr-5 pl-5 rounded-xl'}>
                                <p dir={'auto'} className={'w-[100%] h-[100%]'}>
                                    {conversation.message}
                                </p>
                            </Box>
                        </Box>
                    </Grow>

                    <div id={'divider'} className={"mt-3 mb-3"}></div>

                    <Grow
                        style={{transformOrigin: '0 0 0'}}
                        {...((conversation.response !== undefined && conversation.response.trim().length > 0) ? {timeout: 1000} : {})}
                        in={(conversation.response !== undefined && conversation.response.trim().length > 0)}>
                        <Box id={'response-message'}
                             className={classNames('w-[100%] flex items-start', settings.themeDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
                            <Avatar sx={{marginTop: '3px'}}
                                    src={settings.themeMode === 'dark' ? "/logo/logo_light.svg" : "/logo/logo_dark.svg"}/>
                            <Box
                                className={'m-2 w-[80%] md:w-[70%] lg:w-[60%] transition-transform duration-500 transform text-start pb-3 pr-5 pl-4 rounded-xl'}>
                                <div
                                    className={classNames('w-[100%] h-[100%] prose', settings.themeMode === 'dark' ? 'prose-invert' : '')}
                                    dir={'auto'}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {(showSQL && index === chat.length - 1) ? '``` ' + conversation.agentResponseParam.sql : conversation.response}
                                    </ReactMarkdown>
                                    {(index === chat.length - 1 && conversation.agentResponseParam && conversation.agentResponseParam.sql) && (
                                        <div>
                                            <Button onClick={() => setShowSQL(!showSQL)} variant={'outlined'}
                                                    color={'info'}>{
                                                showSQL ? t('labels.show_message') : t('labels.show_sql')
                                            }</Button>
                                        </div>
                                    )}
                                </div>
                            </Box>
                        </Box>
                    </Grow>

                    <Grow
                        style={{transformOrigin: '0 0 0'}}
                        {...((conversation.response !== undefined && conversation.response.trim().length > 0) ? {timeout: 1000} : {})}
                        in={(conversation.response !== undefined && conversation.response.trim().length > 0)}>
                        <div id={'icons'}
                             className={classNames('w-[100%] ml-14 rtl:pl-14 flex', settings.themeDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
                            <div className={'cursor-pointer'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"/>
                                </svg>
                            </div>
                            <div onClick={() => {
                                handleCopy(conversation, index).then()
                            }} className={'ml-3 cursor-pointer'}>
                                {(showCopied && index === copiedIndex) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0 1 18 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3 1.5 1.5 3-3.75"/>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth={1.5}
                                         stroke="currentColor" className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                                    </svg>
                                )}
                            </div>
                            <div className={'ml-3 cursor-pointer'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth="1.5"
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z"/>
                                </svg>
                            </div>
                        </div>
                    </Grow>

                    <Grow
                        style={{transformOrigin: '0 0 0'}}
                        {...((conversation.response !== undefined && conversation.response.trim().length > 0) ? {timeout: 1500} : {})}
                        in={(conversation.response !== undefined && conversation.response.trim().length > 0)}>
                        <div>
                            <ChatTable showTable={showTable} setShowTable={setShowTable} index={index} chat={chat}
                                       tableHeaders={tableHeaders} tableRows={tableRows}></ChatTable>
                        </div>
                    </Grow>


                </div>
            ))}

            {/*Dummy div for scrolling*/}
            <div ref={messagesEndRef}></div>

            {(chat.length === 0 && agent.selectedAgent && agent.selectedAgent.configuration && agent.selectedAgent.configuration.suggestions) && (
                <ul role="list"
                    className={classNames("absolute flex flex-col w-full sm:flex-row sm:justify-evenly bottom-0 mx-auto",
                        settings.themeMode === 'dark' ? 'text-slate-200' : '')}>
                    {(agent.selectedAgent.configuration.suggestions[0] && agent.selectedAgent.configuration.suggestions[0].trim().length > 0) && (
                        <li className={classNames("group w-full my-2 sm:my-0 sm:w-[48%] col-span-1 rounded-lg shadow transition-colors duration-300",
                            settings.themeMode === 'dark' ? 'bg-slate-800 hover:bg-blue-900' : 'bg-slate-200 hover:bg-blue-200')}>
                            <a onClick={() => handleSendMessage(agent.selectedAgent!.configuration.suggestions![0])} className={classNames("flex cursor-pointer items-center justify-between truncate p-4",
                            settings.themeDirection === 'ltr' ? 'space-x-6' : '')}
                               href="#">
                                <div className="flex flex-col items-center gap-y-1 rounded-lg text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                                    </svg>
                                </div>
                                <div className={classNames("flex-1 truncate", settings.themeDirection === 'rtl' ? 'mr-4' : '')}>
                                    <div className="flex items-center space-x-3">
                                        <h3 className={classNames("text-sm font-bold transition-colors duration-300",
                                            settings.themeMode === 'dark' ? 'text-slate-200  group-hover:text-slate-50' : 'text-slate-900  group-hover:text-black')}>
                                            {t('labels.pre_def_question1')}
                                        </h3>
                                    </div>
                                    <p className={classNames("mt-1 truncate text-sm transition-colors duration-300",
                                        settings.themeMode === 'dark' ? 'text-slate-500 group-hover:text-slate-200' : ' text-slate-500 group-hover:text-slate-900')}>
                                        {agent.selectedAgent.configuration.suggestions[0]}
                                    </p>
                                </div>
                            </a>
                        </li>
                    )}

                    {(agent.selectedAgent.configuration.suggestions[0] && agent.selectedAgent.configuration.suggestions[1].trim().length > 0) && (
                        <li className={classNames("group w-full my-2 sm:my-0 sm:w-[48%] col-span-1 rounded-lg shadow transition-colors duration-300",
                            settings.themeMode === 'dark' ? 'bg-slate-800 hover:bg-blue-900' : 'bg-slate-200 hover:bg-blue-200')}>
                            <a onClick={() => handleSendMessage(agent.selectedAgent!.configuration.suggestions![1])} className={classNames("flex cursor-pointer items-center justify-between truncate p-4",
                                settings.themeDirection === 'ltr' ? 'space-x-6' : '')}
                               href="#">
                                <div className="flex flex-col items-center gap-y-1 rounded-lg text-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                         strokeWidth="1.5"
                                         stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                                    </svg>
                                </div>
                                <div className={classNames("flex-1 truncate", settings.themeDirection === 'rtl' ? 'mr-4' : '')}>
                                    <div className="flex items-center space-x-3">
                                        <h3 className={classNames("text-sm font-bold transition-colors duration-300",
                                            settings.themeMode === 'dark' ? 'text-slate-200  group-hover:text-slate-50' : 'text-slate-900  group-hover:text-black')}>
                                            {t('labels.pre_def_question2')}
                                        </h3>
                                    </div>
                                    <p className={classNames("mt-1 truncate text-sm transition-colors duration-300",
                                        settings.themeMode === 'dark' ? 'text-slate-500 group-hover:text-slate-200' : ' text-slate-500 group-hover:text-slate-900')}>
                                        {agent.selectedAgent.configuration.suggestions[1]}
                                    </p>
                                </div>
                            </a>
                        </li>
                    )}
                </ul>
            )}
        </div>

    );
}
