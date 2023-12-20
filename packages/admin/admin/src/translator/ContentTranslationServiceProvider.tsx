import * as React from "react";

import { ContentTranslationServiceContext, ContentTranslationServiceContextProps } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<ContentTranslationServiceContextProps> = ({
    children,
    enabled,
    translate,
}) => {
    return <ContentTranslationServiceContext.Provider value={{ enabled, translate }}>{children}</ContentTranslationServiceContext.Provider>;
};
