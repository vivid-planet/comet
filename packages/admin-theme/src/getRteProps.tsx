import { CancelButton, DeleteButton, SaveButton } from "@comet/admin";
import { ButtonProps } from "@material-ui/core/Button";
import { ComponentsProps } from "@material-ui/core/styles/props";
import * as React from "react";

export const getRteProps = (): ComponentsProps => ({
    CometAdminRteLinkDialog: {
        cancelButton: (props: ButtonProps) => <CancelButton {...props} />,
        deleteButton: (props: ButtonProps) => <DeleteButton {...props} />,
        saveButton: (props: ButtonProps) => <SaveButton {...props} />,
    },
});
