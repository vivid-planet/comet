import { ArrowLeft } from "@comet/admin-icons";
import { IconButton } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
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
                    size="large"
                >
                    {backIcon}
                </IconButton>
            </ToolbarItem>
        </div>
    ) : null;
}

export const ToolbarBackButton = withStyles(styles, { name: "CometAdminToolbarBackButton" })(BackButton);

declare module "@mui/material/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBackButton: ToolbarBackButtonClassKey;
    }
}

declare module "@mui/material/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarBackButton: ToolbarBackButtonProps;
    }
}
