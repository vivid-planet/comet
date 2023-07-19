import { gql } from "@apollo/client";
import { Field, FinalFormSelect } from "@comet/admin";
import { createEditPageNode } from "@comet/cms-admin";
import { MenuItem } from "@mui/material";
import * as React from "react";
import { FormattedMessage } from "react-intl";
export type { GQLPageTreeNodeAdditionalFieldsFragment } from "./EditPageNode.generated"; //re-export

const userGroupOptions = [
    {
        label: "Show for all",
        value: "All",
    },
    {
        label: "Show only for Group: User",
        value: "User",
    },
    {
        label: "Show only for Group: Admin",
        value: "Admin",
    },
];

export const additionalPageTreeNodeFieldsFragment = {
    fragment: gql`
        fragment PageTreeNodeAdditionalFields on PageTreeNode {
            userGroup
        }
    `,
    name: "PageTreeNodeAdditionalFields",
};

export const EditPageNode = createEditPageNode({
    valuesToInput: ({ values }: { values: { userGroup: string } }) => {
        return {
            userGroup: values.userGroup,
        };
    },
    nodeFragment: additionalPageTreeNodeFieldsFragment,
    additionalFormFields: (
        <div>
            <Field
                label={<FormattedMessage id="pageTreeNode.fields.userGroup" defaultMessage="User-Group" />}
                name="userGroup"
                variant="horizontal"
                fullWidth
            >
                {(props) => (
                    <FinalFormSelect {...props} fullWidth>
                        {userGroupOptions.map((option) => (
                            <MenuItem value={option.value} key={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </FinalFormSelect>
                )}
            </Field>
        </div>
    ),
});
