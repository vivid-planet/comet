import { ArrowLeft } from "@comet/admin-icons";
import { ComponentsOverrides, IconButton, Theme } from "@mui/material";
import { createStyles, WithStyles, withStyles } from "@mui/styles";
import * as React from "react";

import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";

export type ToolbarBackButtonClassKey = "root";
export interface ToolbarBackButtonProps {
    backIcon?: React.ReactNode;
}

const styles = ({ spacing }: Theme) => {
    return createStyles<ToolbarBackButtonClassKey, ToolbarBackButtonProps>({
        root: {
            flex: 0,
            display: "flex",
            alignItems: "stretch",

            "& [class*='CometAdminToolbarItem-root']": {
                padding: 0,
                paddingRight: spacing(3),
            },
        },
    });
};

function BackButton({ backIcon = <ArrowLeft sx={{ fontSize: 24 }} />, classes }: ToolbarBackButtonProps & WithStyles<typeof styles>) {
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

declare module "@mui/material/styles" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBackButton: ToolbarBackButtonClassKey;
    }

    interface ComponentsPropsList {
        CometAdminToolbarBackButton: Partial<ToolbarBackButtonProps>;
    }

    interface Components {
        CometAdminToolbarBackButton?: {
            defaultProps?: ComponentsPropsList["CometAdminToolbarBackButton"];
            styleOverrides?: ComponentsOverrides<Theme>["CometAdminToolbarBackButton"];
        };
    }
}
