import {
    ContentScopeProvider as ContentScopeProviderLibrary,
    type ContentScopeProviderProps,
    StopImpersonationButton,
    useCurrentUser,
} from "@comet/cms-admin";
import { type ContentScope as BaseContentScope } from "@src/site-configs";

declare module "@comet/cms-admin" {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface ContentScope extends BaseContentScope {}
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
        <ContentScopeProviderLibrary values={user.allowedContentScopes} defaultValue={user.allowedContentScopes[0].scope}>
            {children}
        </ContentScopeProviderLibrary>
    );
};
