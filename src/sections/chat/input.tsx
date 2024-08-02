import Box from "@mui/material/Box";
import {alpha} from "@mui/material/styles";
import * as React from "react";
import {SetStateAction} from "react";
import {useSettingsContext} from "../../components/settings";

type Props = {
    inputMessage: string,
    setInputMessage : React.Dispatch<SetStateAction<string>>,
    textAreaRef: React.RefObject<HTMLTextAreaElement>,
    handleSendMessage: any
}

export default function ChatInput({inputMessage, setInputMessage, textAreaRef, handleSendMessage}: Props) {
    const settings = useSettingsContext();

    const handleOnInput = () => {
        textAreaRef.current!.style.height = 'auto'; // Reset height
        textAreaRef.current!.style.height = `${textAreaRef.current!.scrollHeight}px`; // Set height to scroll height
    }

    const handleInputKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault()
            handleSendMessage();
        }
    }

    return (
        <Box sx={{bgcolor: (theme) => alpha(theme.palette.grey[600], 0.1)}}
             className="flex items-center justify-center gap-1.5 md:gap-2 w-[90%] md:w-[80%] lg:w-[70%] mb-2 mr-2 ml-2 rounded-3xl">
            <div
                className="flex flex-col justify-center cursor-pointer items-center rtl:ml-2 rtl:mr-4 ltr:ml-4 ltr:mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                     stroke="currentColor" className="size-7">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"/>
                </svg>
            </div>
            <div className="flex min-w-0 flex-1 flex-col items-start justify-end">
                    <textarea onInput={handleOnInput} ref={textAreaRef} rows={1}
                              onKeyDown={(event) => handleInputKeyDown(event)}
                              onChange={(event) => setInputMessage(event.target.value)} value={inputMessage} dir="auto"
                              placeholder={'Message Intellectera'}
                              className="overflow-y-scroll scrollbar scrollbar-thumb-gray-500m-0 w-[100%] min-h-[50px] max-h-[130px] place-content-center text-lg resize-none border-0 bg-transparent px-0 text-token-text-primary focus:ring-0 focus-visible:ring-0 "
                    ></textarea>
            </div>
            <button onClick={handleSendMessage}
                    className={'flex flex-col justify-center items-center cursor-pointer ltr:ml-2 ltr:mr-4 rtl:ml-4 rtl:mr-2'}>
                {settings.themeDirection === 'ltr' ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                         stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                    </svg>
                ) : (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                          stroke="currentColor" className="size-8">
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>)}
            </button>
        </Box>
    );
}
