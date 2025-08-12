import { type FunctionComponent } from "react";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { StopImpersonationButton } from "../../userPermissions/user/ImpersonationButtons";

export const NoContentScopeError: FunctionComponent = () => {
    const user = useCurrentUser();

    return (
        <>
            Error: user does not have access to any scopes.
            {user.impersonated && <StopImpersonationButton />}
        </>
    );
};
