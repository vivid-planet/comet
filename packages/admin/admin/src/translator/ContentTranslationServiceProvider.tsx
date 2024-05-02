import * as React from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<ContentTranslationServiceContext> = ({
    children,
    enabled,
    showDialog,
    translate,
}) => {
    return (
        <ContentTranslationServiceContext.Provider value={{ enabled, showDialog, translate }}>{children}</ContentTranslationServiceContext.Provider>
    );
};
