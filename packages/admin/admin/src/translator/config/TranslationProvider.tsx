import * as React from "react";

import { TranslationConfig, TranslationConfigContext } from "./TranslationConfigContext";

interface TranslationConfigProviderProps {
    value: TranslationConfig;
}

export const TranslationConfigProvider: React.FunctionComponent<TranslationConfigProviderProps> = ({ children, value }) => {
    return <TranslationConfigContext.Provider value={{ enableTranslation: false, ...value }}>{children}</TranslationConfigContext.Provider>;
};
