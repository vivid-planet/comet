import React from "react";
import { FormattedMessage } from "react-intl";

import { useCurrentUser } from "../userPermissions/hooks/currentUser";

export const DefaultGreeting = () => {
    const user = useCurrentUser();
    return <FormattedMessage id="dashboard.userGreeting" defaultMessage="Hello {givenName}!" values={{ givenName: user.name }} />;
};
