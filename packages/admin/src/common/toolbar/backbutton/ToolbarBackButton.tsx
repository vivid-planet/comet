import { IconButton } from "@material-ui/core";
import { StyledComponentProps } from "@material-ui/core/styles";
import * as React from "react";

import { mergeClasses } from "../../../helpers/mergeClasses";
import { useStackApi } from "../../../stack/Api";
import { ToolbarItem } from "../item/ToolbarItem";
import { CometAdminToolbarBackButtonClassKeys, useStyles, useToolbarBackButtonThemeProps } from "./ToolbarBackButton.styles";

export function ToolbarBackButton({ classes: passedClasses }: StyledComponentProps<CometAdminToolbarBackButtonClassKeys>) {
    const stackApi = useStackApi();
    const classes = mergeClasses<CometAdminToolbarBackButtonClassKeys>(useStyles(), passedClasses);

    const themeProps = useToolbarBackButtonThemeProps();

    return stackApi && stackApi.breadCrumbs.length > 1 ? (
        <div className={classes.root}>
            <ToolbarItem>
                <IconButton
                    onClick={() => {
                        stackApi?.goBack();
                    }}
                >
                    {themeProps.backIcon}
                </IconButton>
            </ToolbarItem>
        </div>
    ) : null;
}
