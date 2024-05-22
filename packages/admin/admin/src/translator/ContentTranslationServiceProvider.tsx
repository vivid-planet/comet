import * as React from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<ContentTranslationServiceContext> = ({
    children,
    enabled,
    showApplyTranslationDialog = true,
    translate,
}) => {
    return (
        <ContentTranslationServiceContext.Provider value={{ enabled, showApplyTranslationDialog, translate }}>
            {children}
        </ContentTranslationServiceContext.Provider>
    );
};
