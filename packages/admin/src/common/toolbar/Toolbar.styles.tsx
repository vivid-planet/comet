import { Theme } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../mui/useComponentThemeProps";

export interface ToolbarThemeProps {
    backIcon?: React.ReactNode;
    elevation?: number;
}

export type CometAdminToolbarClassKeys = "root" | "muiToolbar" | "historyContainer" | "mainContentContainer" | "actionContainer";

export const useToolbarStyles = makeStyles<Theme, { headerHeight: number }, CometAdminToolbarClassKeys>(
    () => ({
        root: {
            position: "sticky",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            top: (props) => props.headerHeight,
            padding: 0,
            "& [class*='MuiButton']": {
                textTransform: "none",
            },
        },
        muiToolbar: {
            display: "flex",
            flex: 1,
            alignItems: "stretch",
        },

        historyContainer: {
            flex: 0,
            display: "flex",
            alignItems: "stretch",

            "& [class*='ToolbarItem']": {
                padding: 0,
                paddingRight: 5,
            },
        },
        mainContentContainer: {
            display: "flex",
            flex: 1,
        },
        actionContainer: {
            display: "flex",
            alignItems: "center",
            /* Margin on all first level children, without last one */
            "& > *:not(:last-child)": {
                marginRight: 20,
            },
        },
    }),
    { name: "CometAdminToolbar" },
);

export function useThemeProps() {
    const { elevation = 4, backIcon = <ArrowBack />, ...restProps } = useComponentThemeProps<ToolbarThemeProps>("CometAdminToolbar") ?? {};
    return { elevation, backIcon, ...restProps };
}

// Theme Augmentation
declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbar: CometAdminToolbarClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbar: ToolbarThemeProps;
    }
}
