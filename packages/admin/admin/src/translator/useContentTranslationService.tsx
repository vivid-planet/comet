import * as React from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export function useContentTranslationService(): ContentTranslationServiceContext {
    return React.useContext(ContentTranslationServiceContext);
}
