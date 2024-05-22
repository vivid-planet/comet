import * as React from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider: React.FunctionComponent<ContentTranslationServiceContext> = ({
    children,
    enabled,
    showApplyTranslationDialog,
    translate,
}) => {
    return (
        <ContentTranslationServiceContext.Provider value={{ enabled, showApplyTranslationDialog, translate }}>
            {children}
        </ContentTranslationServiceContext.Provider>
    );
};
