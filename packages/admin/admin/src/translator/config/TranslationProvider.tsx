import * as React from "react";

import { TranslationConfig, TranslationConfigContext } from "./TranslationConfigContext";

export const TranslationConfigProvider: React.FunctionComponent<TranslationConfig> = ({ children, enabled, translate }) => {
    return <TranslationConfigContext.Provider value={{ enabled, translate }}>{children}</TranslationConfigContext.Provider>;
};
