import { Field, FinalFormCheckbox } from "@comet/admin";
import { UserPermissionsPage as UserPermissions } from "@comet/cms-admin";
import React from "react";
import { FormattedMessage } from "react-intl";

const ProductsPermissionConfiguration = () => (
    <Field
        name="allowCategoriesAdmin"
        component={FinalFormCheckbox}
        type="checkbox"
        label={<FormattedMessage id="userPermissions.allowCategoriesAdmin" defaultMessage="Allow editing categories" />}
    />
);
export const UserPermissionsPage: React.FC = () => <UserPermissions configurationSlots={{ products: ProductsPermissionConfiguration }} />;
