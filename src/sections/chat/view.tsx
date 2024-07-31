import Avatar from "@mui/material/Avatar";
import * as React from "react";
import {alpha} from "@mui/material/styles";
import Box from "@mui/material/Box";
import ReactMarkdown from 'react-markdown'
import {useSettingsContext} from "../../components/settings";
import {useSelectedSessionContext} from "../../layouts/dashboard/context/session-context.tsx";
import {SelectedSessionContextValue} from "../../layouts/dashboard/context/session-provider.tsx";
import {useEffect, useRef, useState} from "react";
import loadChat from "../../utils/calls/chat/load-chat.tsx";
import {Conversation} from "../../utils/dto/Conversation.ts";
import remarkGfm from 'remark-gfm';

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function ChatView() {
    const settings = useSettingsContext();
    const selectedSessionContextValue: SelectedSessionContextValue = useSelectedSessionContext();
    const [chat, setChat] = useState<Array<Conversation>>([]);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    const scrollToBottom = (timeout: number) => {
        setTimeout(() => {
            messagesEndRef.current!.scrollIntoView({behavior: "smooth"})
        }, timeout)
    }

    useEffect(() => {
        scrollToBottom(1000)
    }, []);


    useEffect(() => {
        if (selectedSessionContextValue && selectedSessionContextValue.selectedSession) {
            let selectedSession = selectedSessionContextValue.selectedSession;
            loadChat(selectedSession.id!).then((result) => {
                setChat(result);
                scrollToBottom(500);
            })
        }
    }, [selectedSessionContextValue.selectedSession])

    return (
        <div className={'w-[100%] h-[90vh] overflow-y-scroll flex flex-col items-center justify-evenly'}>
            <div
                className={'relative w-[90%] md:w-[80%] lg:w-[70%] h-[75vh] overflow-y-scroll rounded-lg scrollbar scrollbar-track-transparent'}>
                {chat.map(conversation => (
                    <div key={conversation.id}>
                        <Box id={'request-message'}
                             className={classNames('w-[100%] flex mt-5', settings.themeDirection === 'rtl' ? 'flex-row' : 'flex-row-reverse')}>
                            <Box sx={{bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1)}}
                                 className={'m-2 w-[70%] md:w-[60%] lg:w-[50%] text-start pt-3 pb-3 pr-5 pl-5 rounded-xl'}>
                                <p dir={'auto'} className={'w-[100%] h-[100%]'}>
                                    {conversation.message}
                                </p>
                            </Box>
                        </Box>
                        <div id={'divider'} className={"mt-3 mb-3"}></div>
                        <Box id={'response-message'}
                             className={classNames('w-[100%] flex items-start', settings.themeDirection === 'rtl' ? 'flex-row-reverse' : 'flex-row')}>
                            <Avatar sx={{marginTop: '3px'}}
                                    src={settings.themeMode === 'dark' ? "/logo/logo_light.svg" : "/logo/logo_dark.svg"}/>
                            <Box className={'m-2 w-[80%] md:w-[70%] lg:w-[60%]  text-start pb-3 pr-5 pl-4 rounded-xl'}>
                                <div
                                    className={classNames('w-[100%] h-[100%] prose', settings.themeMode === 'dark' ? 'prose-invert' : '')}
                                    dir={'auto'}>
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                        {conversation.response}
                                    </ReactMarkdown>
                                </div>
                            </Box>
                        </Box>
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
                            <div className={'ml-3 cursor-pointer'}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     strokeWidth={1.5}
                                     stroke="currentColor" className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184"/>
                                </svg>
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
                    </div>
                ))}
                <div className='absolute flex justify-center items-center h-8 bottom-0 left-0 right-0 mx-auto'>
                    <span className='sr-only'>Loading...</span>
                    <div
                        className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700 [animation-delay:-0.3s]'></div>
                    <div
                        className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700 [animation-delay:-0.15s]'></div>
                    <div className='h-3 w-3 mx-1 bg-gray-500 rounded-full animate-bounce duration-700'></div>
                </div>
                <div ref={messagesEndRef}></div>
            </div>

            <Box sx={{bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1)}}
                 className="flex items-center justify-center gap-1.5 md:gap-2 w-[90%] md:w-[80%] lg:w-[70%] mb-2 mr-2 ml-2 rounded-full">
                <div
                    className="flex flex-col justify-center cursor-pointer items-center rtl:ml-2 rtl:mr-4 ltr:ml-4 ltr:mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                         stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"/>
                    </svg>
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start justify-end">
                    <textarea dir="auto" placeholder={'Message Intellectera'}
                              className="m-0 w-[100%] place-content-center text-lg resize-none border-0 bg-transparent px-0 text-token-text-primary focus:ring-0 focus-visible:ring-0 max-h-52"
                    ></textarea>
                </div>
                <button
                    className={'flex flex-col justify-center items-center cursor-pointer ltr:ml-2 ltr:mr-4 rtl:ml-4 rtl:mr-2'}>
                    {settings.themeDirection === 'ltr' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                             stroke="currentColor" className="size-7">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                  d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                        </svg>
                    ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                              stroke="currentColor" className="size-7">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>)}
                </button>
            </Box>

        </div>
    );
}
