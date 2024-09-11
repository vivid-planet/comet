import { FormattedMessage } from "react-intl";

const userGroupOptions = [
    {
        label: <FormattedMessage id="userGroupOptions.All" defaultMessage="Show for all" />,
        value: "All",
    },
    {
        label: <FormattedMessage id="userGroupOptions.User" defaultMessage="Show only for group: User" />,
        value: "User",
    },
    {
        label: <FormattedMessage id="userGroupOptions.Admin" defaultMessage="Show only for group: Admin" />,
        value: "Admin",
    },
];

export { userGroupOptions };
