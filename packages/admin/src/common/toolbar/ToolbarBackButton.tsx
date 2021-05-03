import { IconButton } from "@material-ui/core";
import * as React from "react";

import { useStackApi } from "../../stack";
import { useToolbarBackButtonStyles, useToolbarBackButtonThemeProps } from "./ToolbarBackButton.styles";
import { ToolbarItem } from "./ToolbarItem";

interface ToolbarBackButtonProps {
    component?: (goBack?: () => void) => React.ReactNode;
}
export function ToolbarBackButton({ component }: ToolbarBackButtonProps) {
    const stackApi = useStackApi();
    const classes = useToolbarBackButtonStyles();

    const themeProps = useToolbarBackButtonThemeProps();

    return stackApi && stackApi.breadCrumbs.length > 1 ? (
        <div className={classes.root}>
            {component ? (
                component(stackApi?.goBack)
            ) : (
                <ToolbarItem>
                    <IconButton
                        onClick={() => {
                            stackApi?.goBack?.();
                        }}
                    >
                        {themeProps.backIcon}
                    </IconButton>
                </ToolbarItem>
            )}
        </div>
    ) : null;
}
