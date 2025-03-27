import {
    ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    ContentScopeProviderProps,
    ContentScopeValues,
    useContentScope as useContentScopeLibrary,
    UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
} from "@comet/cms-admin";
import { ContentScope } from "@src/site-configs";

// convenience wrapper for app (Bind Generic)
export function useContentScope(): UseContentScopeApi<ContentScope> {
    return useContentScopeLibrary<ContentScope>();
}

export function useContentScopeConfig(p: ContentScopeConfigProps): void {
    return useContentScopeConfigLibrary(p);
}

export const ContentScopeProvider = ({ children }: Pick<ContentScopeProviderProps, "children">) => {
    const user = useCurrentUser();

    // TODO in COMET: filter already in API, avoid type cast, support labels
    const userContentScopes = user.allowedContentScopes.filter(
        (value, index, self) => self.map((x) => JSON.stringify(x)).indexOf(JSON.stringify(value)) == index,
    ) as ContentScope[];

    const values: ContentScopeValues<ContentScope> = userContentScopes.map((contentScope) => ({
        domain: { value: contentScope.domain },
        language: { value: contentScope.language, label: contentScope.language.toUpperCase() },
    }));

    if (user.allowedContentScopes.length === 0) {
        throw new Error("User does not have access to any scopes.");
    }

    return (
        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={userContentScopes[0]}>
            {children}
        </ContentScopeProviderLibrary>
    );
};
