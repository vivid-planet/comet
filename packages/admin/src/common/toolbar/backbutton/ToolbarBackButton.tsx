import { ArrowLeft } from "@comet/admin-icons";
import { IconButton, WithStyles } from "@material-ui/core";
import { createStyles, withStyles } from "@material-ui/styles";
import * as React from "react";

import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";

export type ToolbarBackButtonClassKey = "root";
export interface ToolbarBackButtonProps {
    backIcon?: React.ReactNode;
}

const styles = () => {
    return createStyles<ToolbarBackButtonClassKey, ToolbarBackButtonProps>({
        root: {
            flex: 0,
            display: "flex",
            alignItems: "stretch",

            "& [class*='CometAdminToolbarItem-root']": {
                padding: 0,
                paddingRight: 5,
            },
        },
    });
};

function BackButton({ backIcon = <ArrowLeft />, classes }: ToolbarBackButtonProps & WithStyles<typeof styles>) {
    const stackApi = useStackApi();

    return stackApi && stackApi.breadCrumbs.length > 1 ? (
        <div className={classes.root}>
            <ToolbarItem>
                <IconButton
                    onClick={() => {
                        stackApi?.goBack();
                    }}
                >
                    {backIcon}
                </IconButton>
            </ToolbarItem>
        </div>
    ) : null;
}

export const ToolbarBackButton = withStyles(styles, { name: "CometAdminToolbarBackButton" })(BackButton);

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBackButton: ToolbarBackButtonClassKey;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarBackButton: ToolbarBackButtonProps;
    }
}
