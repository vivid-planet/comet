import {
    type ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    type ContentScopeProviderProps,
    type ContentScopeValues,
    StopImpersonationButton,
    useContentScope as useContentScopeLibrary,
    type UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
} from "@comet/cms-admin";
import { type ContentScope } from "@src/site-configs";

// convenience wrapper for app (Bind Generic)
export function useContentScope(): UseContentScopeApi<ContentScope> {
    return useContentScopeLibrary<ContentScope>();
}
// @TODO (maybe): make factory in library to statically create Provider

/** @knipignore */
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
        scope: contentScope,
        label: { language: contentScope.language.toUpperCase() },
    }));

    if (user.allowedContentScopes.length === 0) {
        return (
            <>
                Error: user does not have access to any scopes.
                {user.impersonated && <StopImpersonationButton />}
            </>
        );
    }

    return (
        <ContentScopeProviderLibrary<ContentScope> values={values} defaultValue={userContentScopes[0]}>
            {children}
        </ContentScopeProviderLibrary>
    );
};
