import { useCometConfig } from "../config/CometConfigContext";
import { type ContentScope } from "../contentScope/Provider";

export type ContentLanguageConfig = {
    resolveContentLanguageForScope: (scope: ContentScope) => string;
};

export function useContentLanguageConfig(): ContentLanguageConfig {
    const cometConfig = useCometConfig();

    if (!cometConfig.contentLanguage) {
        return { resolveContentLanguageForScope: () => "en" };
    }

    return cometConfig.contentLanguage;
}
