import { type FunctionComponent } from "react";
import { FormattedMessage } from "react-intl";

import { useCurrentUser } from "../../userPermissions/hooks/currentUser";
import { StopImpersonationButton } from "../../userPermissions/user/ImpersonationButtons";

export const NoContentScopeFallback: FunctionComponent = () => {
    const user = useCurrentUser();

    return (
        <>
            <FormattedMessage id="contentScope.noAccess" defaultMessage="Error: user does not have access to any scopes." />
            {user.impersonated && <StopImpersonationButton />}
        </>
    );
};
