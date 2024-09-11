import { useContext } from "react";

import { ContentTranslationServiceContext } from "./ContentTranslationServiceContext";

export function useContentTranslationService(): ContentTranslationServiceContext {
    return useContext(ContentTranslationServiceContext);
}
