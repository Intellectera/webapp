import React, {createContext, useContext} from "react";
import {SelectedAgentContextValue} from "./agent-provider.tsx";

export const SelectedAgentContext: React.Context<SelectedAgentContextValue> = createContext({} as SelectedAgentContextValue);

export const useSelectedAgentContext = () => {
    const context = useContext(SelectedAgentContext);

    if (!context) throw new Error('useSelectedAgentContext must be use inside AgentProvider');

    return context;
};
