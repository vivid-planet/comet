import {
    type ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    type ContentScopeProviderProps,
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
    const user = useCurrentUser<ContentScope>();
    if (user.allowedContentScopes.length === 0) {
        throw new Error("User does not have access to any scopes.");
    }
    return (
        <ContentScopeProviderLibrary<ContentScope> values={user.allowedContentScopesWithLabels} defaultValue={user.allowedContentScopesWithLabels[0]}>
            {children}
        </ContentScopeProviderLibrary>
    );
};
