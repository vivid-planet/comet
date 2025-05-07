import { type ReactNode } from "react";

import { useCometConfig } from "../config/CometConfigContext";
import { warningMessages as cometWarningMessages } from "./warningMessages";

export interface WarningConfig {
    warningMessages: Record<string, ReactNode>;
}

export function useWarningConfig(): WarningConfig {
    const cometConfig = useCometConfig();

    return { ...cometConfig.warnings, warningMessages: { ...cometConfig.warnings?.warningMessages, ...cometWarningMessages } };
}
