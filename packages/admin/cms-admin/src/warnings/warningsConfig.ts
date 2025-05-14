import { type ReactNode } from "react";

import { useCometConfig } from "../config/CometConfigContext";
import { warningMessages as cometWarningMessages } from "./warningMessages";

export interface WarningsConfig {
    messages: Record<string, ReactNode>;
}

export function useWarningsConfig(): WarningsConfig {
    const cometConfig = useCometConfig();

    return { ...cometConfig.warnings, messages: { ...cometConfig.warnings?.messages, ...cometWarningMessages } };
}
