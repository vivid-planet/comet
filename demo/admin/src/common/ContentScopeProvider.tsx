import {
    ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    ContentScopeProviderProps,
    useContentScope as useContentScopeLibrary,
    UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
} from "@comet/cms-admin";

type Domain = "main" | "secondary" | string;
type Language = "en" | string;
export interface ContentScope {
    domain: Domain;
    language: Language;
}

// convenince wrapper for app (Bind Generic)
export function useContentScope(): UseContentScopeApi<ContentScope> {
    return useContentScopeLibrary<ContentScope>();
}

// @TODO (maybe): make factory in library to statically create Provider

export function useContentScopeConfig(p: ContentScopeConfigProps): void {
    return useContentScopeConfigLibrary(p);
}

const ContentScopeProvider = ({ children }: Pick<ContentScopeProviderProps, "children">) => {
    const user = useCurrentUser<ContentScope>();
    return (
        <ContentScopeProviderLibrary<ContentScope> values={user.allowedContentScopesWithLabels} defaultValue={user.allowedContentScopes[0]}>
            {children}
        </ContentScopeProviderLibrary>
    );
};

export default ContentScopeProvider;
