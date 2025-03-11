import { type ContentScopeInterface } from "../contentScope/Provider";
import { useContentLanguageConfig } from "./contentLanguageConfig";

interface UseContentLanguageOptions {
    scope: ContentScopeInterface;
}

export function useContentLanguage({ scope }: UseContentLanguageOptions): string {
    const { resolveContentLanguageForScope } = useContentLanguageConfig();

    return resolveContentLanguageForScope(scope);
}
