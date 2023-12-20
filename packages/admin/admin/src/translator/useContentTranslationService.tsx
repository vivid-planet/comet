import * as React from "react";

import { ContentTranslationServiceContext, ContentTranslationServiceContextProps } from "./ContentTranslationServiceContext";

export function useContentTranslationService(): ContentTranslationServiceContextProps {
    return React.useContext(ContentTranslationServiceContext);
}
