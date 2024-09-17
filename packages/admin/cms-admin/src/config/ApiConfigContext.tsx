// TODO Remove React import once https://github.com/vivid-planet/comet/pull/2526 has been merged.
import React, { createContext, PropsWithChildren, useContext } from "react";

type ApiConfig = {
    url: string;
};

const ApiConfigContext = createContext<ApiConfig | undefined>(undefined);

function ApiConfigProvider({ config, children }: PropsWithChildren<{ config: ApiConfig }>) {
    return <ApiConfigContext.Provider value={config}>{children}</ApiConfigContext.Provider>;
}

function useApiConfig() {
    const context = useContext(ApiConfigContext);

    if (!context) {
        throw new Error("No ApiConfigContext instance can be found. Please ensure that you have called `ApiConfigProvider` higher up in your tree.");
    }

    return context;
}

export type { ApiConfig };
export { ApiConfigProvider, useApiConfig };
