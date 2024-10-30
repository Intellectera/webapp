import * as React from "react";
import {useSelectedSessionContext} from "../../layouts/dashboard/context/session-context.tsx";
import {SelectedSessionContextValue} from "../../layouts/dashboard/context/session-provider.tsx";
import {useEffect, useRef, useState} from "react";
import loadChat from "../../utils/calls/chat/load-chat.ts";
import {Conversation} from "../../utils/dto/Conversation.ts";
import {useSelectedAgentContext} from "../../layouts/dashboard/context/agent-context.tsx";
import {useSelectedWorkspaceContext} from "../../layouts/dashboard/context/workspace-context.tsx";
import sendMessage from "../../utils/calls/chat/send-message.tsx";
import {CustomError} from "../../utils/types.ts";
import Alert from "@mui/material/Alert";
import ChatInput from "./input.tsx";
import ThreeDotsLoading from "./three-dots.tsx";
import ChatBody from "./chat-body.tsx";
import {useTranslation} from "react-i18next";

function classNames(...classes: any) {
    return classes.filter(Boolean).join(' ')
}

export default function ChatView() {
    const selectedSessionContextValue: SelectedSessionContextValue = useSelectedSessionContext();
    const selectedAgentContextValue = useSelectedAgentContext();
    const selectedWorkspaceContextValue = useSelectedWorkspaceContext();
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const {t} = useTranslation();

    const [chat, setChat] = useState<Array<Conversation>>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [inputMessage, setInputMessage] = useState<string>('')
    const [showError, setShowError] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>(t('errors.something_went_wrong'));
    const [tableHeaders, setTableHeaders] = useState<Array<string>>([]);
    const [tableRows, setTableRows] = useState<Array<any>>([]);
    const [showTable, setShowTable] = useState<boolean>(false);

    const scrollToBottom = (timeout: number) => {
        setTimeout(() => {
            messagesEndRef.current!.scrollIntoView({behavior: "smooth"})
        }, timeout)
    }

    useEffect(() => {
        scrollToBottom(1000);
        textAreaRef.current!.focus();
    }, []);


    useEffect(() => {
        if (selectedSessionContextValue && selectedSessionContextValue.selectedSession) {
            let selectedSession = selectedSessionContextValue.selectedSession;
            if (!selectedSession.isNewSessionTriggered){
                loadChat(selectedSession.id!).then((result) => {
                    setChat(result);
                    scrollToBottom(500);
                });
            }
        } else {
            setChat([])
        }
    }, [selectedSessionContextValue.selectedSession]);

    const runChatAnimation = (responseConversation: Conversation) => {
        const chatClone: Conversation[] = [...chat];
        chatClone.pop();
        chatClone.push(responseConversation);
        setChat(chatClone);
        scrollToBottom(50);
    }

    const handleConversationResponse = (conversation: Conversation) => {
        if (!selectedSessionContextValue.selectedSession) {
            let session = conversation.session!;
            session.isNewSessionTriggered = true;
            selectedSessionContextValue.setSelectedSession(session);
        }

        if (conversation.agentResponseParam && conversation.agentResponseParam.data && conversation.agentResponseParam.data.length > 0){
            setTableHeaders(Object.keys(conversation.agentResponseParam.data[0]));
            setTableRows(conversation.agentResponseParam.data)
            setShowTable(true);
        }

        // if (conversation.agentResponseParam.suggestions && conversation.agentResponseParam.suggestions.length > 0){
        //     selectedAgentContextValue.setSelectedAgent((prev) => {
        //         return {...prev!, configuration: {...prev!.configuration, suggestions: conversation.agentResponseParam.suggestions}}
        //     });
        // }
    }

    const handleSendMessage = (inputValue: string = inputMessage.trim()) => {
        setShowTable(false);
        textAreaRef.current!.style.height = 'auto'; // Reset height
        setInputMessage('');
        let agent = selectedAgentContextValue.selectedAgent;
        let workspace = selectedWorkspaceContextValue.selectedWorkspace;
        let session = selectedSessionContextValue.selectedSession;

        if (inputValue.length > 0 && (agent && workspace && !isLoading)) {
            // Push new send message to UI
            let newChat = chat;
            let conversation = new Conversation('', '')
            conversation.message = inputValue;
            conversation.response = '';
            newChat.push(conversation);
            setChat(newChat);

            // Scroll to bottom and start loading
            scrollToBottom(50);
            setIsLoading(true);

            const body = {
                message: inputValue,
                agentId: agent.id,
                session: session,
                workspaceId: workspace.id,
                agentType: agent.type,
                configuration: agent.configuration
            }

            sendMessage(body)
                .then((conversationResponse: Conversation) => {
                    // Scroll to bottom and stop loading
                    scrollToBottom(50);
                    setIsLoading(false);

                    runChatAnimation(conversationResponse);
                    handleConversationResponse(conversationResponse);
                })
                .catch((error: any) => {
                    let err = error as CustomError;
                    if (err.error && err.error.message && err.error.message.length > 0) {
                        setErrorMessage(err.error.message)
                    }
                    setShowError(true);
                    setIsLoading(false);
                    newChat.pop();
                    setChat(newChat);
                    setTimeout(() => {
                        setShowError(false);
                    }, 4000)
                })
        }

    }


    return (
        <div className={' w-[100%] h-[90vh] overflow-y-scroll flex flex-col items-center justify-evenly'}>
            <ChatBody handleSendMessage={handleSendMessage} showTable={showTable} setShowTable={setShowTable} messagesEndRef={messagesEndRef} chat={chat} tableHeaders={tableHeaders} tableRows={tableRows}></ChatBody>

            {/*Loading three dots*/}
            {isLoading && (
                <ThreeDotsLoading></ThreeDotsLoading>
            )}

            {/*Showing error*/}
            {showError && (
                <div onClick={() => {
                    setShowError(false)
                }}
                     className={classNames('my-8 transition-opacity duration-500 w-[100%] flex justify-center', showError ? 'opacity-100' : 'opacity-0')}>
                    <Alert className={classNames(' w-[85%]')} variant="filled" severity="error">
                        {errorMessage}
                    </Alert>
                </div>
            )}

            <ChatInput setIsLoading={setIsLoading} inputMessage={inputMessage} setInputMessage={setInputMessage} textAreaRef={textAreaRef} handleSendMessage={handleSendMessage}></ChatInput>
        </div>
    );
}
