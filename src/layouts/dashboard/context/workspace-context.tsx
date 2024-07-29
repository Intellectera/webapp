import React, {createContext, useContext} from "react";
import {SelectedWorkspaceContextValue} from "./workspace-provider.tsx";

export const SelectedWorkspaceContext: React.Context<SelectedWorkspaceContextValue> = createContext({} as SelectedWorkspaceContextValue);

export const useSelectedWorkspaceContext = () => {
    const context = useContext(SelectedWorkspaceContext);

    if (!context) throw new Error('useSelectedWorkspaceContext must be use inside WorkspaceProvider');

    return context;
};
