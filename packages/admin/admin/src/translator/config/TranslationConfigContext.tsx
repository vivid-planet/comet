import * as React from "react";

export interface TranslationConfig {
    enableTranslation?: boolean;
    translate?: (input: string, language?: string) => string;
}

export const TranslationConfigContext = React.createContext<TranslationConfig | undefined>(undefined);
