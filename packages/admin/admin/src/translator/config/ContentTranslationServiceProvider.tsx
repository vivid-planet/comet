import * as React from "react";

import { ContentTranslationServiceContext, TranslationConfig } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<TranslationConfig> = ({ children, enabled, translate }) => {
    return <ContentTranslationServiceContext.Provider value={{ enabled, translate }}>{children}</ContentTranslationServiceContext.Provider>;
};
