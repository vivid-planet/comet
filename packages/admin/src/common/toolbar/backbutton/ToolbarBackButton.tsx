import { IconButton } from "@material-ui/core";
import * as React from "react";

import { useStackApi } from "../../../stack";
import { ToolbarItem } from "../item/ToolbarItem";
import { useStyles, useToolbarBackButtonThemeProps } from "./ToolbarBackButton.styles";

export function ToolbarBackButton() {
    const stackApi = useStackApi();
    const classes = useStyles();

    const themeProps = useToolbarBackButtonThemeProps();

    return stackApi && stackApi.breadCrumbs.length > 1 ? (
        <div className={classes.root}>
            <ToolbarItem>
                <IconButton
                    onClick={() => {
                        stackApi?.goBack?.();
                    }}
                >
                    {themeProps.backIcon}
                </IconButton>
            </ToolbarItem>
        </div>
    ) : null;
}
