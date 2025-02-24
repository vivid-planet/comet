import { createContext, type PropsWithChildren, useContext } from "react";

export interface CometConfig {
    apiUrl: string;
    graphQLApiUrl: string;
    adminUrl: string;
}

const CometConfigContext = createContext<CometConfig | undefined>(undefined);

export function CometConfigProvider({ children, ...config }: PropsWithChildren<CometConfig>) {
    return <CometConfigContext.Provider value={config}>{children}</CometConfigContext.Provider>;
}

export function useCometConfig() {
    const context = useContext(CometConfigContext);

    if (!context) {
        throw new Error(
            "No CometConfigContext instance can be found. Please ensure that you have called `CometConfigProvider` higher up in your tree.",
        );
    }

    return context;
}
