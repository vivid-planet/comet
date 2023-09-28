import { gql, useQuery } from "@apollo/client";
import React from "react";
import { FormattedMessage } from "react-intl";

import { GQLDashboardCurrentUserNameQuery } from "./DefaultGreeting.generated";

const CURRENT_USER_NAME_QUERY = gql`
    query DashboardCurrentUserName {
        currentUser {
            name
        }
    }
`;

export const DefaultGreeting = () => {
    const { data } = useQuery<GQLDashboardCurrentUserNameQuery>(CURRENT_USER_NAME_QUERY);

    if (data) {
        return <FormattedMessage id="dashboard.userGreeting" defaultMessage="Hello {givenName}!" values={{ givenName: data.currentUser.name }} />;
    }

    return <FormattedMessage id="dashboard.greeting" defaultMessage="Hello!" />;
};
