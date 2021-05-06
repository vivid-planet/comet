import { Theme } from "@material-ui/core/styles";
import { ArrowBack } from "@material-ui/icons";
import { makeStyles } from "@material-ui/styles";
import * as React from "react";

import { useComponentThemeProps } from "../../../mui/useComponentThemeProps";

export interface ToolbarBackButtonThemeProps {
    backIcon?: React.ReactNode;
}

export type CometAdminToolbarBackButtonClassKeys = "root";

export const useStyles = makeStyles<Theme, {}, CometAdminToolbarBackButtonClassKeys>(
    () => ({
        root: {
            flex: 0,
            display: "flex",
            alignItems: "stretch",

            "& [class*='CometAdminToolbarItem-root']": {
                padding: 0,
                paddingRight: 5,
            },
        },
    }),
    { name: "CometAdminToolbarBackButton" },
);

export function useToolbarBackButtonThemeProps() {
    const { backIcon = <ArrowBack />, ...restProps } = useComponentThemeProps<ToolbarBackButtonThemeProps>("CometAdminToolbarBackButton") ?? {};
    return { backIcon, ...restProps };
}

declare module "@material-ui/core/styles/overrides" {
    interface ComponentNameToClassKey {
        CometAdminToolbarBackButton: CometAdminToolbarBackButtonClassKeys;
    }
}

declare module "@material-ui/core/styles/props" {
    interface ComponentsPropsList {
        CometAdminToolbarBackButton: ToolbarBackButtonThemeProps;
    }
}
