import * as React from "react";

import { ContentTranslationServiceContext, TranslationConfig } from "./ContentTranslationServiceContext";

export function useContentTranslationServiceProvider(): TranslationConfig {
    const context = React.useContext(ContentTranslationServiceContext);
    return context ?? {};
}
