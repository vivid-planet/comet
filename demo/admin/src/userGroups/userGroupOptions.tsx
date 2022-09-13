import * as React from "react";
import { FormattedMessage } from "react-intl";

const userGroupOptions = [
    {
        label: <FormattedMessage id="cometDemo.userGroupOptions.All" defaultMessage="Show for all" />,
        value: "All",
    },
    {
        label: <FormattedMessage id="cometDemo.userGroupOptions.User" defaultMessage="Show only for group: User" />,
        value: "User",
    },
    {
        label: <FormattedMessage id="cometDemo.userGroupOptions.Admin" defaultMessage="Show only for group: Admin" />,
        value: "Admin",
    },
];

export { userGroupOptions };
