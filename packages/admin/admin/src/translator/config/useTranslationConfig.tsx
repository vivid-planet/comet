import * as React from "react";

import { TranslationConfig, TranslationConfigContext } from "./TranslationConfigContext";

export function useTranslationConfig(): TranslationConfig {
    const context = React.useContext(TranslationConfigContext);
    return context ?? {};
}
