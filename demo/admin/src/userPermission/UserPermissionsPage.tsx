import { Field, FinalFormCheckbox } from "@comet/admin";
import { UserPermissionsPage as UserPermissions } from "@comet/cms-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

const NewsPermissionConfiguration = () => (
    <Field
        name="commentsEdit"
        component={FinalFormCheckbox}
        type="checkbox"
        label={<FormattedMessage id="userPermissions.newsComent" defaultMessage="Allow editing News-Comments" />}
    />
);
export const UserPermissionsPage: React.FC = () => <UserPermissions configurationSlots={{ news: NewsPermissionConfiguration }} />;
