import { useCometConfig } from "../config/CometConfigContext";
import { type ContentScopeInterface } from "../contentScope/Provider";

export type ContentLanguageConfig = {
    resolveContentLanguageForScope: (scope: ContentScopeInterface) => string;
};

export function useContentLanguageConfig(): ContentLanguageConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.contentLanguage) {
        return { resolveContentLanguageForScope: () => "en" };
    }

    return cometConfig.contentLanguage;
}
