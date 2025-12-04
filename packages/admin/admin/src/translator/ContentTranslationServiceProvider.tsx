import { type PropsWithChildren } from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export const ContentTranslationServiceProvider = ({
    children,
    enabled,
    showApplyTranslationDialog,
    translate,
}: PropsWithChildren<ContentTranslationServiceContext>) => {
    return (
        <ContentTranslationServiceContext.Provider value={{ enabled, showApplyTranslationDialog, translate }}>
            {children}
        </ContentTranslationServiceContext.Provider>
    );
};
