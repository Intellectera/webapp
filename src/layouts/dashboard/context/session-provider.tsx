import React, {Dispatch, SetStateAction, useState} from "react";
import {Session} from "../../../utils/dto/Session.ts";
import {SelectedSessionContext} from "./session-context.tsx";

export interface SelectedSessionContextValue {
    selectedSession: Session | undefined;
    setSelectedSession: Dispatch<SetStateAction<Session | undefined>>;
}


const SelectedSessionProvider = ({children}: Props) => {
    const [selectedSession, setSelectedSession] = useState<Session | undefined>(undefined);
    const value : SelectedSessionContextValue = {selectedSession, setSelectedSession};

    return (
        <SelectedSessionContext.Provider value={value}>
            {children}
        </SelectedSessionContext.Provider>
    );
};

interface Props {
    children: React.ReactNode;
}

export {SelectedSessionContext, SelectedSessionProvider};
