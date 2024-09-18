// TODO Remove React import once https://github.com/vivid-planet/comet/pull/2526 has been merged.
import React, { createContext, PropsWithChildren, useContext } from "react";

interface BaseCometConfig {
    apiUrl: string;
    adminUrl: string;
    fileUploads?: {
        maxFileSize: number;
    };
    imgproxy: {
        maxSrcResolution: number;
        quality: number;
    };
    dam: {
        uploadsMaxFileSize: number;
        allowedImageSizes: number[];
        allowedImageAspectRatios: string[];
    };
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CometConfig extends BaseCometConfig {}

const CometConfigContext = createContext<CometConfig | undefined>(undefined);

function CometConfigProvider({ config, children }: PropsWithChildren<{ config: CometConfig }>) {
    return <CometConfigContext.Provider value={config}>{children}</CometConfigContext.Provider>;
}

function useCometConfig() {
    const context = useContext(CometConfigContext);

    if (!context) {
        throw new Error(
            "No CometConfigContext instance can be found. Please ensure that you have called `CometConfigProvider` higher up in your tree.",
        );
    }

    return context;
}

export type { BaseCometConfig, CometConfig };
export { CometConfigProvider, useCometConfig };
