import { createContext, PropsWithChildren, useContext } from "react";

import { DamConfig } from "../dam/config/damConfig";
import { ImgproxyConfig } from "../imgproxy/imgproxyConfig";
import { PageTreeConfig } from "../pages/pageTreeConfig";

export interface CometConfig {
    apiUrl: string;
    adminUrl: string;
    fileUploads?: {
        maxFileSize: number;
    };
    imgproxy?: ImgproxyConfig;
    dam?: DamConfig;
    pageTree?: PageTreeConfig;
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
