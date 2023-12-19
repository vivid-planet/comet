import * as React from "react";

import { ContentTranslationServiceContext, TranslationConfig } from "./ContentTranslationServiceContext";

export function useContentTranslationServiceProvider(): TranslationConfig {
    return React.useContext(ContentTranslationServiceContext);
}
