import React, {createContext} from "react";
import {SelectedWorkspaceContextValue} from "./workspace-provider.tsx";

export const SelectedWorkspaceContext: React.Context<SelectedWorkspaceContextValue> = createContext({} as SelectedWorkspaceContextValue);

