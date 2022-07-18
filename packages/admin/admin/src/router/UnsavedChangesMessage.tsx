import { Warning } from "@comet/admin-icons";
import { ComponentsOverrides, Theme, Typography } from "@mui/material";
import { WithStyles, withStyles } from "@mui/styles";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { styles, UnsavedChangesMessageClassKey } from "./UnsavedChangesMessage.styles";

const InternalUnsavedChangesMessage = ({ classes }: WithStyles<typeof styles>) => {
    return (
        <div className={classes.root}>
            <Warning className={classes.warningIcon} />
            <Typography className={classes.text}>
                <FormattedMessage id="cometAdmin.generic.doYouWantToSaveYourChanges" defaultMessage="Do you want to save your changes?" />
            </Typography>
        </div>
    );
};

export const UnsavedChangesMessage = withStyles(styles, { name: "CometAdminUnsavedChangesMessage" })(InternalUnsavedChangesMessage);

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminUnsavedChangesMessage: UnsavedChangesMessageClassKey;
    }

    interface Components {
        CometAdminUnsavedChangesMessage?: {
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminUnsavedChangesMessage"];
        };
    }
}
