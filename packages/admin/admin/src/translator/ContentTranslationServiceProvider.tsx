import * as React from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<ContentTranslationServiceContext> = ({ children, enabled, translate }) => {
    return <ContentTranslationServiceContext.Provider value={{ enabled, translate }}>{children}</ContentTranslationServiceContext.Provider>;
};
