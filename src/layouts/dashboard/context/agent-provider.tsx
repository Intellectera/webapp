import React, {Dispatch, SetStateAction, useState} from "react";
import {Agent} from "../../../utils/dto/Agent.ts";
import {localStorageGetItem} from "../../../utils/storage-available.ts";
import {SelectedAgentContext} from "./agent-context.tsx";

export interface SelectedAgentContextValue {
    selectedAgent: Agent | undefined;
    setSelectedAgent: Dispatch<SetStateAction<Agent | undefined>>;
}

export const AGENT_STORAGE_KEY = "SAV";

const SelectedAgentProvider = ({children}: Props) => {
    let defaultAgent = undefined;
    let item = localStorageGetItem(AGENT_STORAGE_KEY, '');
    if (item && item.length > 0){
        defaultAgent = JSON.parse(item) as Agent;
    }
    const [selectedAgent, setSelectedAgent] = useState<Agent | undefined>(defaultAgent);
    const value : SelectedAgentContextValue = {selectedAgent, setSelectedAgent};

    return (
        <SelectedAgentContext.Provider value={value}>
            {children}
        </SelectedAgentContext.Provider>
    );
};

interface Props {
    children: React.ReactNode;
}

export {SelectedAgentContext, SelectedAgentProvider};
