import {
    type ContentScope,
    type ContentScopeConfigProps,
    ContentScopeProvider as ContentScopeProviderLibrary,
    type ContentScopeProviderProps,
    StopImpersonationButton,
    useContentScope as useContentScopeLibrary,
    type UseContentScopeApi,
    useContentScopeConfig as useContentScopeConfigLibrary,
    useCurrentUser,
} from "@comet/cms-admin";
import { type ContentScope as BaseContentScope } from "@src/site-configs";

declare module "@comet/cms-admin" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
}

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

    if (user.allowedContentScopes.length === 0) {
        return (
            <>
                Error: user does not have access to any scopes.
                {user.impersonated && <StopImpersonationButton />}
            </>
        );
    }

    return (
        <ContentScopeProviderLibrary<ContentScope> values={user.allowedContentScopes} defaultValue={user.allowedContentScopes[0].scope}>
            {children}
        </ContentScopeProviderLibrary>
    );
};
