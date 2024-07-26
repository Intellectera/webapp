import React, {Dispatch, SetStateAction, useState} from 'react';
import {Workspace} from "../../../utils/dto/Workspace.ts";
import { SelectedWorkspaceContext } from './workspace-context.tsx';
import {localStorageGetItem} from "../../../utils/storage-available.ts";

// Define a type for the context value
export interface SelectedWorkspaceContextValue {
    selectedWorkspace: Workspace | undefined;
    setSelectedWorkspace: Dispatch<SetStateAction<Workspace | undefined>>;
}

export const WORKSPACE_STORAGE_KEY = "SWO";


const SelectedWorkspaceProvider = ({children}: Props) => {
    let defaultWorkspace = undefined;
    let item = localStorageGetItem(WORKSPACE_STORAGE_KEY, '');
    if (item && item.length > 0){
        defaultWorkspace = JSON.parse(item) as Workspace;
    }
    const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>(defaultWorkspace);
    const value : SelectedWorkspaceContextValue = {selectedWorkspace, setSelectedWorkspace};

    return (
        <SelectedWorkspaceContext.Provider value={value}>
            {children}
        </SelectedWorkspaceContext.Provider>
    );
};

interface Props {
    children: React.ReactNode;
}

export {SelectedWorkspaceContext, SelectedWorkspaceProvider};
