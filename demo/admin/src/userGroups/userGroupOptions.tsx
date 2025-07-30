import { FormattedMessage } from "react-intl";

const userGroupOptions = [
    {
        label: <FormattedMessage id="userGroupOptions.All" defaultMessage="Show for all" />,
        value: "all",
    },
    {
        label: <FormattedMessage id="userGroupOptions.User" defaultMessage="Show only for group: User" />,
        value: "user",
    },
    {
        label: <FormattedMessage id="userGroupOptions.Admin" defaultMessage="Show only for group: Admin" />,
        value: "admin",
    },
];

export { userGroupOptions };
