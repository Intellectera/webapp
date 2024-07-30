import React, {createContext, useContext} from "react";
import {SelectedSessionContextValue} from "./session-provider.tsx";

export const SelectedSessionContext: React.Context<SelectedSessionContextValue> = createContext({} as SelectedSessionContextValue);

export const useSelectedSessionContext = () => {
    const context = useContext(SelectedSessionContext);

    if (!context) throw new Error('useSelectedSessionContext must be use inside SessionProvider');

    return context;
};
